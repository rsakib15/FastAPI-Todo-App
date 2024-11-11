import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <div className="container mt-5 text-center">
        <h1 className="display-4">Welcome to ToDo App</h1>
        <p className="lead">
          This application helps you manage your tasks efficiently.
        </p>
        <hr />
        <div className="btn-group mt-4">
          <Link to="/login" className="btn btn-primary btn-lg me-2">
            Login
          </Link>
          <Link to="/register" className="btn btn-secondary btn-lg me-2">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
