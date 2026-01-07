from pydantic import BaseModel
from typing import Optional, Dict, List


class PreferenceBase(BaseModel):
    interests: Optional[Dict[str, int]] = None  # {"adventure": 8, "cultural": 6}
    budget_range: Optional[str] = None  # "budget", "mid-range", "luxury"
    fitness_level: Optional[int] = None  # 1-5
    travel_style: Optional[str] = None  # "solo", "couple", "family", "group"
    preferred_seasons: Optional[List[str]] = None  # ["spring", "autumn"]
    duration_days: Optional[int] = None
    difficulty_preference: Optional[int] = None  # 1-5


class PreferenceCreate(PreferenceBase):
    pass


class Preference(PreferenceBase):
    preference_id: int
    user_id: int

    class Config:
        from_attributes = True


class RecommendationRequest(BaseModel):
    limit: Optional[int] = 10


class RecommendationResponse(BaseModel):
    destination_id: int
    name: str
    score: float
    category: str
    description: str
    image_url: Optional[str] = None
