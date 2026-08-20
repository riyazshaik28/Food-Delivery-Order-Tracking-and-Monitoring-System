from fastapi import APIRouter, Depends, Query,HTTPException, status
from database import get_session
from models import Order, OrderStatus,OrderUpdateStatus
from sqlmodel import Session, select
from sqlalchemy import func
from typing import Optional
from datetime import datetime, date
from fastapi import Path
router = APIRouter(
    prefix="/status",
    tags=["Status"]
)

@router.get("/order_daily")
def summary_orders(
    summary_date: Optional[date] = Query(
        None,
        description="Filter by summary date in YYYY-MM-DD format"
    ),
    db: Session = Depends(get_session)
):
    if summary_date is None:
        summary_date = date.today()

    start = datetime.combine(summary_date, datetime.min.time())
    end = datetime.combine(summary_date, datetime.max.time())

    summary = {}
    total = 0

    for status in OrderStatus:
        count = db.exec(
            select(func.count(Order.id))
            .where(Order.status == status)
            .where(Order.Created_at.between(start, end))
        ).one()

        summary[status.value] = count
        total += count

    return {
        "date": str(summary_date),
        "by_status": summary,
        "total_orders": total
    }

@router.patch("/order/{order_id}", response_model=OrderUpdateStatus)
def update_order_status(
    order_id: int,
    new_status: OrderStatus,
    db: Session = Depends(get_session)
):
    order = db.get(Order, order_id)

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    old_status = order.status

    order.status = new_status
    order.Updated_at = datetime.now()

    db.add(order)
    db.commit()
    db.refresh(order)

    return OrderUpdateStatus(
    customer_name=order.customer_name,
    items=order.items,
    status=order.status,
    delivery_address=order.delivery_address,
    updated_at=order.Updated_at
)


@router.delete("/order/{id}")
def delete_order(
    id:int,
    db: Session = Depends(get_session)

):
    order=db.get(Order,id)
    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )
    db.delete(order)
    db.commit()
    return {"message": "Order deleted successfully"}