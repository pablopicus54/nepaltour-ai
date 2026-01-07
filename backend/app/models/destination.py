from sqlalchemy import Column, Integer, String, Text, Boolean, Numeric, JSON
from app.database import Base


class Destination(Base):
    __tablename__ = "destinations"

    destination_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    location = Column(String(255))
    latitude = Column(Numeric(10, 8))
    longitude = Column(Numeric(11, 8))
    category = Column(String(100), index=True)
    description = Column(Text)
    activities = Column(JSON)  # Array of activities
    difficulty_level = Column(Integer)  # 1-5
    best_season = Column(String(50))
    avg_cost_per_day = Column(Integer)  # USD
    duration_days = Column(Integer)
    popularity_score = Column(Integer)  # 1-100
    altitude = Column(Integer)  # Meters
    permits_required = Column(Boolean, default=False)
    image_url = Column(String(500))
