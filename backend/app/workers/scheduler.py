from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.core.logging import logger

scheduler = AsyncIOScheduler()


async def scheduled_health_check_job():
    logger.info("[Scheduler Job] Running background system check...")


def start_scheduler():
    scheduler.add_job(scheduled_health_check_job, 'interval', minutes=30)
    scheduler.start()
    logger.info("APScheduler initialized and started in background.")
