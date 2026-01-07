from sqlalchemy import Column, Integer, String, ForeignKey, JSON, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Itinerary(Base):
    __tablename__ = "itineraries"

    itinerary_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    title = Column(String(255))
    destinations = Column(JSON)  # Array of destination_ids with days
    total_days = Column(Integer)
    total_cost = Column(Integer)  # USD
    created_at = Column(DateTime(timezone=True), server_default=func.now())
