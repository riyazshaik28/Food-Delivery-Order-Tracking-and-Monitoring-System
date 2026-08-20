from sqlmodel import SQLModel, Field
from datetime import datetime
from enum import Enum
from typing import Optional


class OrderStatus(Enum):
    PREPARING = "preparing"
    PICKED_UP = "picked_up"
    DELIVERED = "delivered"
    IN_TRANSIT = "in_transit"

# database table for orders
class Order(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    customer_name: str
    delivery_address: str 
    items: str
    status: OrderStatus = Field(default=OrderStatus.PREPARING)
    Created_at: datetime = Field(default_factory=datetime.now)
    Updated_at: datetime = Field(default_factory=datetime.now)

  # schema for creating a new order  
class OrderCreated(SQLModel):
    customer_name: str
    delivery_address: str
    items: str
    status: Optional[OrderStatus] = None
 # schema for updating an existing order
class OrderUpdateStatus(SQLModel):
    customer_name: Optional[str] = None
    items: Optional[str] = None
    status: Optional[OrderStatus] = None
    delivery_address: Optional[str] = None
    updated_at: datetime = Field(default_factory=datetime.now)
# schema for returning order details
class StatusLog(SQLModel):
    order_id: int
    old_status: str
    new_status: str
    changed_at: datetime = Field(default_factory=datetime.now)
