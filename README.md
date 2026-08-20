# Food Delivery Order Tracking and Monitoring System

A full-stack food delivery tracking application built with FastAPI on the backend and React on the frontend. The system helps manage food orders from order placement to final delivery by allowing users to create, view, update, filter, and monitor order status in real time.

## Features

- Create new food delivery orders
- View all orders
- Get a specific order by ID
- Update order status as delivery progresses
- Delete orders
- View daily order summary by status
- Filter orders by status and date
- SQLite database support
- Swagger/OpenAPI API documentation
- Modern React-based frontend dashboard

## Tech Stack

### Backend
- Python
- FastAPI
- SQLModel
- SQLite
- Uvicorn

### Frontend
- React
- Vite
- JavaScript
- Tailwind CSS

## Project Structure

```bash
FOOD DELIVERY ORDER TRACKING AND MONITORING SYSTEM/
├── main.py
├── database.py
├── models.py
├── requirements.txt
├── ORDERS.db
├── routers/
│   ├── orders.py
│   └── status.py
├── frontend-react/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── dist/
├── env/
├── .gitignore
└── README.md
```

## Prerequisites

Make sure the following are installed:

- Python 3.9 or later
- Node.js and npm
- Git

## Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd "FOOD DELIVERY ORDER TRACKING AND MONITORING SYSTEM"
```

### 2. Create a virtual environment

For Windows:

```bash
python -m venv env
env\Scripts\activate
```

For Linux/macOS:

```bash
python3 -m venv env
source env/bin/activate
```

### 3. Install backend dependencies

```bash
pip install -r requirements.txt
```

### 4. Install frontend dependencies

```bash
cd frontend-react
npm install
```

## Running the Application

### Start the backend

From the project root:

```bash
uvicorn main:app --reload
```

The backend will be available at:

- http://localhost:8000
- API docs: http://localhost:8000/docs
- ReDoc docs: http://localhost:8000/redoc

### Start the frontend

From the `frontend-react` directory:

```bash
npm run dev
```

The frontend will run at:

- http://localhost:5173

## API Endpoints

### Orders

- `POST /orders/createorder` - Create a new order
- `GET /orders/getorder/{order_id}` - Get an order by ID
- `GET /orders/allorders` - Get all orders
- `GET /orders/getorderbyid` - Filter orders by status and date

### Status

- `GET /status/order_daily` - Get daily summary of orders by status
- `PATCH /status/order/{order_id}` - Update order status
- `DELETE /status/order/{id}` - Delete an order

## Order Statuses

- `preparing`
- `picked_up`
- `in_transit`
- `delivered`

## Example Requests

### Create an order

```bash
curl -X POST "http://localhost:8000/orders/createorder" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "delivery_address": "123 Main Street, City A",
    "items": "Burger, Fries, Soda",
    "status": "preparing"
  }'
```

### Get all orders

```bash
curl "http://localhost:8000/orders/allorders"
```

### Get order by ID

```bash
curl "http://localhost:8000/orders/getorder/1"
```

### Update order status

```bash
curl -X PATCH "http://localhost:8000/status/order/1?new_status=in_transit"
```

### Get daily summary

```bash
curl "http://localhost:8000/status/order_daily?summary_date=2026-08-20"
```

## Database

This project uses SQLite with a local database file named:

```bash
ORDERS.db
```

The database tables are created automatically when the FastAPI app starts.

## Frontend

The frontend is located in the `frontend-react` directory. It provides a simple, user-friendly UI to:

- monitor orders
- create new orders
- track current progress
- check daily status summaries

## Future Enhancements

- User authentication and authorization
- Real-time order updates with WebSockets
- Driver tracking with live location
- Payment integration
- Admin dashboard
- Email/SMS notifications
- Docker support
- Cloud deployment

## Contributing

Contributions are welcome. You can fork the repository, make improvements, and submit a pull request.

## License

This project is available for educational and personal use. If needed, add an appropriate license such as MIT or Apache 2.0.

## Author

Your Name  
Email: sshaikriyaz252@gmail.com  
GitHub: https://github.com/riyazshaik28

## Notes

This project is designed to help food delivery startups or restaurant businesses monitor and manage order flow effectively. It provides a lightweight backend and responsive frontend for tracking delivery operations.
