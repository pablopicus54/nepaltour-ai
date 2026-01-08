from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import auth, destinations, recommendations, itineraries

# Initialize FastAPI app
app = FastAPI(
    title="NepalTourAI API",
    description="Intelligent Tourism Recommendation System for Nepal",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(destinations.router, prefix="/api/destinations", tags=["Destinations"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["Recommendations"])
app.include_router(itineraries.router, prefix="/api/itineraries", tags=["Itineraries"])


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Welcome to NepalTourAI API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "docs": "/docs",
            "auth": "/api/auth",
            "destinations": "/api/destinations",
            "recommendations": "/api/recommendations",
            "itineraries": "/api/itineraries"
        }
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
