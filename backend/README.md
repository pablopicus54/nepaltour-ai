# NepalTourAI Backend

FastAPI backend for the NepalTourAI recommendation system.

## Setup

### 1. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 4. Run the Server

```bash
cd app
uvicorn main:app --reload
```

The API will be available at http://localhost:8000

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app
│   ├── config.py            # Configuration
│   ├── database.py          # Database connection
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Pydantic schemas
│   ├── routes/              # API endpoints
│   ├── ml_engine/           # ML recommendation engine
│   └── utils/               # Utility functions
└── requirements.txt
```
