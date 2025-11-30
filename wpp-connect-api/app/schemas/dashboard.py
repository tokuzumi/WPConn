from pydantic import BaseModel
from typing import List, Dict, Any

class KPIData(BaseModel):
    pending_webhooks: int
    error_rate_24h: float
    daily_messages: int
    active_tenants: int

class HourlyTraffic(BaseModel):
    hour: str
    inbound: int
    outbound: int

class MessageStatusDistribution(BaseModel):
    status: str
    count: int

class EventHealth(BaseModel):
    status: str
    count: int

class CriticalError(BaseModel):
    id: Any
    tenant_name: str
    event: str
    detail: str
    created_at: str

class DashboardStatsResponse(BaseModel):
    kpis: KPIData
    hourly_traffic: List[HourlyTraffic]
    status_distribution: List[MessageStatusDistribution]
    event_health: List[EventHealth]
    recent_errors: List[CriticalError]
