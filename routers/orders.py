from fastapi import APIRouter, Depends, HTTPException, status,Query
from database import get_session
from models import Order, OrderCreated, OrderUpdateStatus, StatusLog,OrderStatus
from sqlmodel import Session, select
from typing import Optional,List
from datetime import datetime
router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("/createorder",response_model=Order,)
def create_order(order:OrderCreated,session:Session=Depends(get_session)):
    """Create a new order"""
    payload = order.model_dump(exclude_none=True)
    new_order = Order(**payload)
    session.add(new_order)
    session.commit()
    session.refresh(new_order)
    return new_order

@router.get("/getorder/{order_id}", response_model=Order)
def get_order(order_id: int, session: Session = Depends(get_session)):
    """Get order details by order ID"""
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order

@router.get("/allorders",response_model=List[Order])
def get_all_orders(session: Session = Depends(get_session)):
    """Get details of all orders"""
    orders = session.exec(select(Order)).all()
    return orders

@router.get("/getorderbyid",response_model=List[Order])
def get_order_by_id(
    status:OrderStatus = Query(None, description="Filter by order status"),
    session: Session = Depends(get_session),
    offset:int=Query(default=0,ge=0,description="number of records to skip"),
    limit:int=Query(default=10,ge=1,le=50,description="number of records to return"),
    created_date:Optional[str]=Query(None,description="Filter by created date in YYYY-MM-DD format")
):
    """Get order details by order ID"""
    query=select(Order)
    
    if status:
        query=query.where(Order.status==status)
    if created_date:
        date_obj = datetime.strptime(created_date, "%Y-%m-%d").date()

        start = datetime.combine(date_obj, datetime.min.time())
        end = datetime.combine(date_obj, datetime.max.time())
        query=query.where(Order.Created_at.between(start,end))
        query=query.offset(offset).limit(limit)
        orders=session.exec(query).all()
        return orders
    