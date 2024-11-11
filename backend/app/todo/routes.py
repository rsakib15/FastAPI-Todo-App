# app/todo/routes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List  # Import List for response type
from ..db import get_db
from ..models import todo as todo_model
from ..models.user import User  # Import User model
from .schemas import TodoCreate, TodoResponse
from ..auth.jwt import get_current_user

router = APIRouter()

@router.post("/", response_model=TodoResponse)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_todo = todo_model.Todo(title=todo.title, description=todo.description, owner_id=current_user.id)
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return new_todo

@router.get("/", response_model=List[TodoResponse])
def read_todos(skip: int = 0, limit: int = 10, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get a list of todos for the current user."""
    todos = db.query(todo_model.Todo).filter(todo_model.Todo.owner_id == current_user.id).offset(skip).limit(limit).all()
    return todos

@router.get("/{todo_id}", response_model=TodoResponse)
def read_todo(todo_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get a specific todo item by ID."""
    todo = db.query(todo_model.Todo).filter(todo_model.Todo.id == todo_id, todo_model.Todo.user_id == current_user.id).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo

@router.put("/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, todo: TodoCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Update a todo item."""
    existing_todo = db.query(todo_model.Todo).filter(todo_model.Todo.id == todo_id, todo_model.Todo.user_id == current_user.id).first()
    if not existing_todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    existing_todo.title = todo.title
    existing_todo.description = todo.description
    db.commit()
    db.refresh(existing_todo)
    return existing_todo

@router.delete("/{todo_id}", response_model=TodoResponse)
def delete_todo(todo_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Delete a todo item."""
    todo = db.query(todo_model.Todo).filter(todo_model.Todo.id == todo_id, todo_model.Todo.user_id == current_user.id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    db.delete(todo)
    db.commit()
    return todo
