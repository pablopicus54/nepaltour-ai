from sqlalchemy import Column, Integer, ForeignKey, Numeric, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Recommendation(Base):
    __tablename__ = "recommendations"

    recommendation_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    destination_id = Column(Integer, ForeignKey("destinations.destination_id"), nullable=False)
    score = Column(Numeric(5, 4))  # ML similarity score
    created_at = Column(DateTime(timezone=True), server_default=func.now())
