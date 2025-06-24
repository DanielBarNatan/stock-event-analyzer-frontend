from fastapi import APIRouter, HTTPException, Query
import json
from app.services.openai_service import get_historical_event

router = APIRouter()

@router.get("/api/historical-event")
async def historical_event(query: str = Query(..., description="Search query for historical event")):
    try:
        if not query:
            raise HTTPException(status_code=400, detail="Query parameter is required")
        
        response_content = await get_historical_event(query)
        
        try:
            # Parse the response to ensure it's valid JSON
            event_data = json.loads(response_content)
            return event_data
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Failed to parse historical event data")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 