from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

# Import API routes
from app.routes.acne import router as acne_router
from app.routes.puffy_eyes import router as puffy_eyes_router
from app.routes.inpainting import router as inpainting_router
from app.routes.analyze_skin import router as analyze_skin_router
from app.routes.acne_severity import router as acne_sev_router
from app.routes.skin_type import router as skin_type_router
# Initialize FastAPI
app = FastAPI(title="AI-Powered Skin Care API", version="1.0")

# Configure logging
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(acne_router, prefix="/api/acne")
app.include_router(acne_sev_router, prefix="/api/acne_severity")
app.include_router(puffy_eyes_router, prefix="/api/puffy_eyes")
app.include_router(inpainting_router, prefix="/api/inpainting")
app.include_router(analyze_skin_router, prefix="/api/skin_analysis")
app.include_router(skin_type_router, prefix="/api/skin_type")
@app.get("/")
async def root():
    return {"message": "Welcome to AI-Powered Skin Care API"}

# ✅ Custom Error Handling for Unhandled Exceptions
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error", "details": str(exc)},
    )

# ✅ Custom Error Handling for Not Found Routes
@app.exception_handler(HTTPException)
async def not_found_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": "Not Found", "details": exc.detail},
    )
