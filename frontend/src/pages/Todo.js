// src/pages/Todo.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // Import the Navbar component

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch todos from the backend when the component is mounted
  useEffect(() => {
    const token = Cookies.get("access_token");

    if (!token) {
      navigate("/login"); // Redirect to login if no token
      return;
    }

    const fetchTodos = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/todos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTodos(response.data);
      } catch (error) {
        setError("Failed to fetch todos");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [navigate]);

  // Get the username from the token (assuming the token is a JWT)
  const getUsernameFromToken = () => {
    const token = Cookies.get("access_token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
      return payload.username; // Adjust this based on your token structure
    }
    return "";
  };

  // Handle form submission to add a new todo
  const handleAddTodo = async (e) => {
    e.preventDefault();
    const token = Cookies.get("access_token");

    if (newTodo.trim() === "") {
      setError("Todo cannot be empty");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/todos",
        { title: newTodo },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTodos([...todos, response.data]);
      setNewTodo(""); // Clear input field
    } catch (error) {
      setError("Failed to add new todo");
    }
  };

  // Handle marking todo as completed
  const handleCompleteTodo = async (todoId) => {
    const token = Cookies.get("access_token");

    try {
      await axios.put(
        `http://localhost:8000/todos/${todoId}`,
        { completed: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTodos(
        todos.map((todo) =>
          todo.id === todoId ? { ...todo, completed: true } : todo
        )
      );
    } catch (error) {
      setError("Failed to mark todo as completed");
    }
  };

  return (
    <div className="container mt-5">
      <Navbar username={getUsernameFromToken()} /> {/* Add the Navbar here */}
      <h2 className="text-center">Todo List</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleAddTodo} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Add a new todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Add Todo
          </button>
        </div>
      </form>
      {loading ? (
        <p>Loading todos...</p>
      ) : (
        <ul className="list-group">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`list-group-item d-flex justify-content-between align-items-center ${
                todo.completed ? "list-group-item-success" : ""
              }`}
            >
              {todo.title}
              {!todo.completed && (
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => handleCompleteTodo(todo.id)}
                >
                  Complete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Todo;
