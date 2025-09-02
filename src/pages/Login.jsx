import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import authService from "../services/authService";
import databaseService from "../services/expense";
import { login as storeLogin, setExpenses } from "../store/userSlice";
import { Link, useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
import "./Login.css";

import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginDetails({
      ...loginDetails,
      [e.target.name]: e.target.value,
    });
  };

  const login = async (e) => {
    e.preventDefault();

    if (loginDetails.email === "" || loginDetails.password.trim() === "") {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const session = await authService.login({
        email: loginDetails.email,
        password: loginDetails.password,
      });
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(storeLogin(userData));
          const expenses = await databaseService.getExpenses(userData.$id);
          console.log("Fetched expenses:", expenses.documents); // Add this
          const expensesArray = expenses.documents;
          dispatch(setExpenses(expensesArray));
        }
        toast.success("Login successful");
        navigate("/dashboard");
      } else {
        toast.error("User not found");
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>

        <form onSubmit={login} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={loginDetails.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={loginDetails.password}
            onChange={handleChange}
          />

          <button type="submit">Sign in</button>
          <p className="signup-text">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
