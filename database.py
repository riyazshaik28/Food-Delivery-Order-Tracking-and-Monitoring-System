from sqlmodel import SQLModel, Field, create_engine, Session, select
from models import Order, StatusLog

DB_URL = "sqlite:///ORDERS.db"
engine = create_engine(DB_URL, echo=True)

def create_tables():
    """Create the database tables if they don't exist"""
    SQLModel.metadata.create_all(engine)
    print("Tables created successfully.")

def get_session():
    """Dependency that provides a database session per request"""
    with Session(engine) as session:
        yield session