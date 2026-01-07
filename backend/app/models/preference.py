from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class UserPreference(Base):
    __tablename__ = "user_preferences"

    preference_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    interests = Column(JSON)  # {"adventure": 8, "cultural": 6, "nature": 9}
    budget_range = Column(String(50))  # "budget", "mid-range", "luxury"
    fitness_level = Column(Integer)  # 1-5
    travel_style = Column(String(50))  # "solo", "couple", "family", "group"
    preferred_seasons = Column(JSON)  # ["spring", "autumn"]
    duration_days = Column(Integer)
    difficulty_preference = Column(Integer)  # 1-5
