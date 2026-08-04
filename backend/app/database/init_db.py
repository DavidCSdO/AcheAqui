import asyncio
from app.core.database import engine, Base
from app.core.logging import logger
import app.models  # Ensures all models are registered


async def init_db():
    logger.info("Initializing database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables initialized successfully.")


if __name__ == "__main__":
    asyncio.run(init_db())
