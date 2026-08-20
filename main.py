from pathlib import Path
from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from database import create_tables
from routers.orders import router as orders_router
from routers.status import router as status_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables when app starts
    create_tables()
    yield
    # Perform any cleanup tasks here if needed


PROJECT_ROOT = Path(__file__).resolve().parent
FRONTEND_DIR = PROJECT_ROOT / "frontend"
REACT_FRONTEND_DIR = PROJECT_ROOT / "frontend-react" / "dist"

app = FastAPI(
    title="Food Delivery Order Tracking and Monitoring System",
    description="A RESTful API built for a food delivery startup that enables users to track and monitor their food delivery orders in real-time. The API powers the application's order tracking section by allowing users to create, view, update, and manage their orders while providing real-time updates on the status of their deliveries.",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# Mount static folders only if they exist (old static prototype or built React assets)
if (FRONTEND_DIR / "static").exists():
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR / "static"), name="static")
elif (REACT_FRONTEND_DIR).exists() and (REACT_FRONTEND_DIR / "assets").exists():
    app.mount("/assets", StaticFiles(directory=REACT_FRONTEND_DIR / "assets"), name="assets")

app.include_router(orders_router)
app.include_router(status_router)

@app.get("/")
def read_root():
    if (REACT_FRONTEND_DIR / "index.html").exists():
        return FileResponse(REACT_FRONTEND_DIR / "index.html")
    return FileResponse(FRONTEND_DIR / "index.html")

@app.get("/{path:path}")
def serve_frontend(path: str):
    if path.startswith("assets") or path.startswith("static"):
        if (REACT_FRONTEND_DIR / path).exists():
            return FileResponse(REACT_FRONTEND_DIR / path)
    if (REACT_FRONTEND_DIR / "index.html").exists():
        return FileResponse(REACT_FRONTEND_DIR / "index.html")
    return FileResponse(FRONTEND_DIR / "index.html")
