from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.dashboard import DashboardStatsResponse, KPIData

router = APIRouter()

@router.get("/stats", response_model=DashboardStatsResponse)
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)):
    from app.db.repositories.dashboard_repository import DashboardRepository
    repo = DashboardRepository(db)
    
    pending_webhooks = await repo.get_pending_webhooks_count()
    error_rate = await repo.get_error_rate_24h()
    daily_messages = await repo.get_daily_messages_count()
    active_tenants = await repo.get_active_tenants_count()
    
    hourly_traffic = await repo.get_hourly_traffic()
    status_distribution = await repo.get_message_status_distribution()
    event_health = await repo.get_event_health()
    recent_errors = await repo.get_recent_critical_errors()
    
    return {
        "kpis": {
            "pending_webhooks": pending_webhooks,
            "error_rate_24h": error_rate,
            "daily_messages": daily_messages,
            "active_tenants": active_tenants
        },
        "hourly_traffic": hourly_traffic,
        "status_distribution": status_distribution,
        "event_health": event_health,
        "recent_errors": recent_errors
    }
