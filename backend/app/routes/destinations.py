from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.destination import Destination
from app.schemas.destination import Destination as DestinationSchema

router = APIRouter()


@router.get("/", response_model=List[DestinationSchema])
def get_all_destinations(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    category: Optional[str] = None,
    min_cost: Optional[int] = None,
    max_cost: Optional[int] = None,
    difficulty: Optional[int] = None,
    season: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all destinations with optional filters"""

    query = db.query(Destination)

    # Apply filters
    if category:
        query = query.filter(Destination.category == category)

    if min_cost is not None:
        query = query.filter(Destination.avg_cost_per_day >= min_cost)

    if max_cost is not None:
        query = query.filter(Destination.avg_cost_per_day <= max_cost)

    if difficulty is not None:
        query = query.filter(Destination.difficulty_level == difficulty)

    if season:
        query = query.filter(Destination.best_season == season)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Destination.name.ilike(search_term)) |
            (Destination.description.ilike(search_term)) |
            (Destination.location.ilike(search_term))
        )

    destinations = query.offset(skip).limit(limit).all()
    return destinations


@router.get("/{destination_id}", response_model=DestinationSchema)
def get_destination(destination_id: int, db: Session = Depends(get_db)):
    """Get a single destination by ID"""

    destination = db.query(Destination).filter(
        Destination.destination_id == destination_id
    ).first()

    if not destination:
        raise HTTPException(status_code=404, detail="Destination not found")

    return destination


@router.get("/category/{category}", response_model=List[DestinationSchema])
def get_destinations_by_category(
    category: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get destinations by category"""

    destinations = db.query(Destination).filter(
        Destination.category == category
    ).offset(skip).limit(limit).all()

    return destinations


@router.get("/popular/top", response_model=List[DestinationSchema])
def get_popular_destinations(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Get most popular destinations"""

    destinations = db.query(Destination).order_by(
        Destination.popularity_score.desc()
    ).limit(limit).all()

    return destinations
