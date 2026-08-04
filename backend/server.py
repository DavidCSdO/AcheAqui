import site
import sys
import os
import asyncio

if hasattr(site, "USER_SITE") and site.USER_SITE not in sys.path:
    sys.path.insert(0, site.USER_SITE)

if sys.platform == 'win32':
    try:
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    except Exception:
        pass

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import logger
from app.database.init_db import init_db
from app.workers.scheduler import start_scheduler
from app.api.v1.router import api_router
from app.api.legacy import legacy_router

# Setup sys.path for compatibility
sys.path.append(os.path.dirname(__file__))

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Clean Architecture API para prospecção de empresas brasileiras no AcheAqui.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    logger.info("Starting AcheAqui Backend v3.0...")
    await init_db()
    start_scheduler()


# Include Router v1 (/api/v1) and Legacy Router (/api)
app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(legacy_router)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=True)
