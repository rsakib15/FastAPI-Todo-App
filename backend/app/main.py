# main.py
from fastapi import FastAPI
from .db import engine, Base
from .models import user, todo
from .auth import routes as auth_routes
from .todo import routes as todo_routes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost"
    "http://localhost:3000",
    "*"  # Change this to your frontend URL
    # Add more origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Include the auth router
app.include_router(auth_routes.router, prefix="/auth", tags=["Auth"])
app.include_router(todo_routes.router, prefix="/todos", tags=["Todos"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI Todo App!"}
