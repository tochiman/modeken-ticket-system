from pydantic import BaseModel, Field
from typing import Optional

class Item(BaseModel):
    itemType: str = Field(..., min_length=1, max_length=10)
    itemNumber: Optional[int]