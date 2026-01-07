from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.preference import (
    PreferenceCreate,
    Preference,
    RecommendationRequest,
    RecommendationResponse
)
from app.models.preference import UserPreference
from app.models.destination import Destination
from app.ml_engine.recommender import recommender

router = APIRouter()


@router.post("/preferences", response_model=Preference)
def save_preferences(
    user_id: int,
    preferences: PreferenceCreate,
    db: Session = Depends(get_db)
):
    """Save or update user preferences"""

    # Check if preferences exist
    existing = db.query(UserPreference).filter(
        UserPreference.user_id == user_id
    ).first()

    if existing:
        # Update existing
        for key, value in preferences.dict(exclude_unset=True).items():
            setattr(existing, key, value)
        db.commit()
        db.refresh(existing)
        return existing
    else:
        # Create new
        new_pref = UserPreference(user_id=user_id, **preferences.dict())
        db.add(new_pref)
        db.commit()
        db.refresh(new_pref)
        return new_pref


@router.get("/preferences/{user_id}", response_model=Preference)
def get_preferences(user_id: int, db: Session = Depends(get_db)):
    """Get user preferences"""

    pref = db.query(UserPreference).filter(
        UserPreference.user_id == user_id
    ).first()

    if not pref:
        raise HTTPException(status_code=404, detail="Preferences not found")

    return pref


@router.post("/recommend/{user_id}", response_model=List[RecommendationResponse])
def get_recommendations(
    user_id: int,
    request: RecommendationRequest,
    db: Session = Depends(get_db)
):
    """Get ML-based recommendations for user"""

    # Get user preferences
    prefs = db.query(UserPreference).filter(
        UserPreference.user_id == user_id
    ).first()

    if not prefs:
        raise HTTPException(
            status_code=404,
            detail="Please set your preferences first"
        )

    # Convert to dict for ML engine
    user_prefs_dict = {
        'interests': prefs.interests or {},
        'budget_range': prefs.budget_range or 'mid-range',
        'fitness_level': prefs.fitness_level or 3,
        'difficulty_preference': prefs.difficulty_preference or 2,
        'preferred_seasons': prefs.preferred_seasons or ['Spring', 'Autumn']
    }

    try:
        # Get recommendations from ML engine
        recommendations = recommender.get_recommendations(
            user_preferences=user_prefs_dict,
            db=db,
            n_recommendations=request.limit
        )

        # Fetch destination details
        result = []
        for dest_id, dest_name, score in recommendations:
            dest = db.query(Destination).filter(
                Destination.destination_id == dest_id
            ).first()

            if dest:
                result.append(RecommendationResponse(
                    destination_id=dest.destination_id,
                    name=dest.name,
                    score=round(score, 4),
                    category=dest.category or "Unknown",
                    description=dest.description or "",
                    image_url=dest.image_url
                ))

        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating recommendations: {str(e)}"
        )
