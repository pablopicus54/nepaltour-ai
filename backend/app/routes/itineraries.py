from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import json

from app.database import get_db
from app.models.itinerary import Itinerary
from app.models.destination import Destination
from app.utils.auth import get_current_user
from app.models.user import User

router = APIRouter()


@router.post("/create")
async def create_itinerary(
    title: str,
    destination_ids: List[int],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new itinerary from selected destinations
    """
    try:
        # Fetch selected destinations
        destinations = db.query(Destination).filter(
            Destination.destination_id.in_(destination_ids)
        ).all()

        if not destinations:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No valid destinations found"
            )

        # Calculate total days and cost
        total_days = sum(dest.duration_days for dest in destinations)
        total_cost = sum(dest.avg_cost_per_day * dest.duration_days for dest in destinations)

        # Build itinerary structure
        itinerary_destinations = []
        current_day = 1

        for dest in destinations:
            itinerary_destinations.append({
                "destination_id": dest.destination_id,
                "name": dest.name,
                "location": dest.location,
                "start_day": current_day,
                "end_day": current_day + dest.duration_days - 1,
                "duration_days": dest.duration_days,
                "cost": dest.avg_cost_per_day * dest.duration_days,
                "activities": json.loads(dest.activities) if isinstance(dest.activities, str) else dest.activities,
                "description": dest.description,
                "difficulty_level": dest.difficulty_level,
                "altitude": dest.altitude
            })
            current_day += dest.duration_days

        # Create itinerary
        itinerary = Itinerary(
            user_id=current_user.user_id,
            title=title,
            destinations=json.dumps(itinerary_destinations),
            total_days=total_days,
            total_cost=total_cost,
            created_at=datetime.utcnow()
        )

        db.add(itinerary)
        db.commit()
        db.refresh(itinerary)

        return {
            "itinerary_id": itinerary.itinerary_id,
            "title": itinerary.title,
            "destinations": itinerary_destinations,
            "total_days": total_days,
            "total_cost": total_cost,
            "created_at": itinerary.created_at
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create itinerary: {str(e)}"
        )


@router.get("/my-itineraries")
async def get_user_itineraries(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all itineraries for the current user
    """
    itineraries = db.query(Itinerary).filter(
        Itinerary.user_id == current_user.user_id
    ).order_by(Itinerary.created_at.desc()).all()

    result = []
    for itinerary in itineraries:
        destinations = json.loads(itinerary.destinations) if isinstance(itinerary.destinations, str) else itinerary.destinations
        result.append({
            "itinerary_id": itinerary.itinerary_id,
            "title": itinerary.title,
            "destinations": destinations,
            "total_days": itinerary.total_days,
            "total_cost": itinerary.total_cost,
            "created_at": itinerary.created_at
        })

    return result


@router.get("/{itinerary_id}")
async def get_itinerary(
    itinerary_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific itinerary by ID
    """
    itinerary = db.query(Itinerary).filter(
        Itinerary.itinerary_id == itinerary_id,
        Itinerary.user_id == current_user.user_id
    ).first()

    if not itinerary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Itinerary not found"
        )

    destinations = json.loads(itinerary.destinations) if isinstance(itinerary.destinations, str) else itinerary.destinations

    return {
        "itinerary_id": itinerary.itinerary_id,
        "title": itinerary.title,
        "destinations": destinations,
        "total_days": itinerary.total_days,
        "total_cost": itinerary.total_cost,
        "created_at": itinerary.created_at
    }


@router.delete("/{itinerary_id}")
async def delete_itinerary(
    itinerary_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete an itinerary
    """
    itinerary = db.query(Itinerary).filter(
        Itinerary.itinerary_id == itinerary_id,
        Itinerary.user_id == current_user.user_id
    ).first()

    if not itinerary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Itinerary not found"
        )

    db.delete(itinerary)
    db.commit()

    return {"message": "Itinerary deleted successfully"}


@router.post("/auto-generate")
async def auto_generate_itinerary(
    budget: int,
    duration_days: int,
    interests: List[str],
    difficulty_preference: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Auto-generate an itinerary based on user preferences
    """
    try:
        # Query destinations matching preferences
        query = db.query(Destination)

        # Filter by interests (categories)
        if interests:
            query = query.filter(Destination.category.in_(interests))

        # Filter by difficulty
        query = query.filter(Destination.difficulty_level <= difficulty_preference)

        # Get destinations sorted by popularity
        destinations = query.order_by(Destination.popularity_score.desc()).all()

        if not destinations:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No destinations match your preferences"
            )

        # Select destinations that fit the duration and budget
        selected_destinations = []
        current_days = 0
        current_cost = 0

        for dest in destinations:
            projected_days = current_days + dest.duration_days
            projected_cost = current_cost + (dest.avg_cost_per_day * dest.duration_days)

            if projected_days <= duration_days and projected_cost <= budget:
                selected_destinations.append(dest.destination_id)
                current_days = projected_days
                current_cost = projected_cost

            if current_days >= duration_days * 0.9:  # Fill at least 90% of duration
                break

        if not selected_destinations:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unable to create itinerary within budget and duration constraints"
            )

        # Create itinerary using the create endpoint logic
        destinations_data = db.query(Destination).filter(
            Destination.destination_id.in_(selected_destinations)
        ).all()

        total_days = sum(dest.duration_days for dest in destinations_data)
        total_cost = sum(dest.avg_cost_per_day * dest.duration_days for dest in destinations_data)

        itinerary_destinations = []
        current_day = 1

        for dest in destinations_data:
            itinerary_destinations.append({
                "destination_id": dest.destination_id,
                "name": dest.name,
                "location": dest.location,
                "start_day": current_day,
                "end_day": current_day + dest.duration_days - 1,
                "duration_days": dest.duration_days,
                "cost": dest.avg_cost_per_day * dest.duration_days,
                "activities": json.loads(dest.activities) if isinstance(dest.activities, str) else dest.activities,
                "description": dest.description,
                "difficulty_level": dest.difficulty_level,
                "altitude": dest.altitude
            })
            current_day += dest.duration_days

        itinerary = Itinerary(
            user_id=current_user.user_id,
            title=f"Auto-Generated Trip - {duration_days} Days",
            destinations=json.dumps(itinerary_destinations),
            total_days=total_days,
            total_cost=total_cost,
            created_at=datetime.utcnow()
        )

        db.add(itinerary)
        db.commit()
        db.refresh(itinerary)

        return {
            "itinerary_id": itinerary.itinerary_id,
            "title": itinerary.title,
            "destinations": itinerary_destinations,
            "total_days": total_days,
            "total_cost": total_cost,
            "created_at": itinerary.created_at
        }

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate itinerary: {str(e)}"
        )
