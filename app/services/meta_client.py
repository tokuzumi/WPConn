import httpx
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

class MetaClient:
    def __init__(self, tenant_token: str, phone_number_id: str):
        self.token = tenant_token
        self.phone_number_id = phone_number_id
        self.base_url = "https://graph.facebook.com/v17.0"
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }

    async def get_media_url(self, media_id: str) -> str:
        """
        Retrieves the temporary download URL for a media object.
        """
        url = f"{self.base_url}/{media_id}"
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers)
            if response.status_code == 200:
                return response.json().get("url")
            else:
                logger.error(f"Failed to get media URL: {response.text}")
                return None

    from contextlib import asynccontextmanager

    @asynccontextmanager
    async def get_media_stream(self, url: str):
        """
        Yields a stream of the media content.
        """
        async with httpx.AsyncClient() as client:
            async with client.stream("GET", url, headers={"Authorization": f"Bearer {self.token}"}) as response:
                if response.status_code == 200:
                    yield response.aiter_bytes()
                else:
                    logger.error(f"Failed to download media: {response.status_code}")
                    yield None

    async def send_message(self, payload: dict):
        url = f"{self.base_url}/{self.phone_number_id}/messages"
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=self.headers)
            if response.status_code not in [200, 201]:
                logger.error(f"Failed to send message: {response.text}")
                return None
            return response.json()
