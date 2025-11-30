from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, case, desc
from app.db.models import Message, WebhookEvent, Tenant, AuditLog
from datetime import datetime, timedelta

class DashboardRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_pending_webhooks_count(self) -> int:
        query = select(func.count()).select_from(WebhookEvent).where(WebhookEvent.status == 'pending')
        result = await self.db.execute(query)
        return result.scalar() or 0

    async def get_error_rate_24h(self) -> float:
        one_day_ago = datetime.utcnow() - timedelta(days=1)
        
        # Count total events in last 24h
        total_query = select(func.count()).select_from(WebhookEvent).where(WebhookEvent.created_at >= one_day_ago)
        total_result = await self.db.execute(total_query)
        total = total_result.scalar() or 0
        
        if total == 0:
            return 0.0
            
        # Count failed events in last 24h
        failed_query = select(func.count()).select_from(WebhookEvent).where(
            WebhookEvent.created_at >= one_day_ago,
            WebhookEvent.status == 'failed'
        )
        failed_result = await self.db.execute(failed_query)
        failed = failed_result.scalar() or 0
        
        return (failed / total) * 100

    async def get_daily_messages_count(self) -> int:
        today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        query = select(func.count()).select_from(Message).where(Message.created_at >= today_start)
        result = await self.db.execute(query)
        return result.scalar() or 0

    async def get_active_tenants_count(self) -> int:
        query = select(func.count()).select_from(Tenant).where(Tenant.is_active == True)
        result = await self.db.execute(query)
        return result.scalar() or 0

    async def get_hourly_traffic(self):
        today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Group by hour and direction
        hour_col = func.date_trunc('hour', Message.created_at).label('hour')
        
        query = select(
            hour_col,
            Message.direction,
            func.count().label('count')
        ).where(
            Message.created_at >= today_start
        ).group_by(
            hour_col,
            Message.direction
        ).order_by(hour_col)
        
        result = await self.db.execute(query)
        rows = result.all()
        
        # Process results into structured data
        traffic_map = {}
        for row in rows:
            hour_str = row.hour.strftime("%H:00")
            if hour_str not in traffic_map:
                traffic_map[hour_str] = {"inbound": 0, "outbound": 0}
            
            traffic_map[hour_str][row.direction] = row.count
            
        return [
            {"hour": h, "inbound": d["inbound"], "outbound": d["outbound"]}
            for h, d in traffic_map.items()
        ]

    async def get_message_status_distribution(self):
        query = select(
            Message.status,
            func.count().label('count')
        ).group_by(Message.status)
        
        result = await self.db.execute(query)
        return [{"status": row.status, "count": row.count} for row in result.all()]

    async def get_event_health(self):
        query = select(
            WebhookEvent.status,
            func.count().label('count')
        ).group_by(WebhookEvent.status)
        
        result = await self.db.execute(query)
        return [{"status": row.status, "count": row.count} for row in result.all()]

    async def get_recent_critical_errors(self, limit: int = 5):
        # Fetch recent failed webhook events joined with tenant info if possible
        # Since WebhookEvent doesn't strictly link to Tenant in the model shown previously (it stores payload),
        # we might rely on AuditLog for "critical errors" or just list failed WebhookEvents.
        # Let's use AuditLog for errors if available, or fallback to WebhookEvents.
        # User requested: "Últimos Erros Críticos" listando os registros mais recentes de `audit_logs` ou `webhook_events`
        
        # Let's try AuditLog first where event='error'
        query = select(
            AuditLog.id,
            Tenant.name.label('tenant_name'),
            AuditLog.event,
            AuditLog.detail,
            AuditLog.created_at
        ).outerjoin(
            Tenant, AuditLog.tenant_id == Tenant.id
        ).where(
            AuditLog.event == 'error'
        ).order_by(
            desc(AuditLog.created_at)
        ).limit(limit)
        
        result = await self.db.execute(query)
        rows = result.all()
        
        return [
            {
                "id": row.id,
                "tenant_name": row.tenant_name or "Unknown",
                "event": row.event,
                "detail": row.detail or "",
                "created_at": row.created_at.isoformat()
            }
            for row in rows
        ]
