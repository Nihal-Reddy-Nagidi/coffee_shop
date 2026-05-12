from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

class Coffee(BaseModel):
    id: int
    name: str
    description: str | None = None
    price: float

class CoffeeCreate(BaseModel):
    name: str
    description: str | None = None
    price: float

class CoffeeUpdate(BaseModel):
    price: float

class User(BaseModel):
    id: int
    name: str
    email: str

user_data = User(id=1, name="Coffee Lover", email="coffee@example.com")

# In-memory storage for coffee items
coffee_items: List[Coffee] = [
    Coffee(id=1, name="Espresso", description="Strong and bold", price=200),
    Coffee(id=2, name="Latte", description="Milk and espresso", price=3.5),
    Coffee(id=3, name="Americano", description="Espresso with hot water", price=2.0),
]
next_id = 4

@app.get("/coffees", response_model=List[Coffee])
def list_coffees():
    return coffee_items

@app.get("/coffees/{coffee_id}", response_model=Coffee)
def get_coffee(coffee_id: int):
    for coffee in coffee_items:
        if coffee.id == coffee_id:
            return coffee
    raise HTTPException(status_code=404, detail="Coffee item not found")

@app.post("/coffees", response_model=Coffee, status_code=201)
def create_coffee(coffee: CoffeeCreate):
    global next_id
    new_coffee = Coffee(id=next_id, name=coffee.name, description=coffee.description, price=coffee.price)
    coffee_items.append(new_coffee)
    next_id += 1
    return new_coffee

@app.put("/coffees/{coffee_id}", response_model=Coffee)
def update_coffee(coffee_id: int, coffee_update: CoffeeUpdate):
    for index, coffee in enumerate(coffee_items):
        if coffee.id == coffee_id:
            updated_coffee = coffee.copy(update={"price": coffee_update.price})
            coffee_items[index] = updated_coffee
            return updated_coffee
    raise HTTPException(status_code=404, detail="Coffee item not found")

@app.delete("/coffees/{coffee_id}", status_code=204)
def delete_coffee(coffee_id: int):
    for index, coffee in enumerate(coffee_items):
        if coffee.id == coffee_id:
            del coffee_items[index]
            return
    raise HTTPException(status_code=404, detail="Coffee item not found")

@app.get("/user", response_model=User)
def read_user():
    return user_data
