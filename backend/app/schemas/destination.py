from pydantic import BaseModel
from typing import Optional, List
from decimal import Decimal


class DestinationBase(BaseModel):
    name: str
    location: Optional[str] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    category: Optional[str] = None
    description: Optional[str] = None
    activities: Optional[List[str]] = None
    difficulty_level: Optional[int] = None
    best_season: Optional[str] = None
    avg_cost_per_day: Optional[int] = None
    duration_days: Optional[int] = None
    popularity_score: Optional[int] = None
    altitude: Optional[int] = None
    permits_required: Optional[bool] = False
    image_url: Optional[str] = None


class DestinationCreate(DestinationBase):
    pass


class Destination(DestinationBase):
    destination_id: int

    class Config:
        from_attributes = True


class DestinationFilter(BaseModel):
    category: Optional[str] = None
    min_cost: Optional[int] = None
    max_cost: Optional[int] = None
    difficulty_level: Optional[int] = None
    season: Optional[str] = None
    search: Optional[str] = None
