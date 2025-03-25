from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import acne, puffy_eyes, inpainting

app = FastAPI(title="AI-Powered Skin Care API", version="1.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(acne.router, prefix="/api")
app.include_router(puffy_eyes.router, prefix="/api")
app.include_router(inpainting.router, prefix="/api")  # ✅ Add Inpainting route

@app.get("/")
async def root():
    return {"message": "Welcome to AI-Powered Skin Care API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
