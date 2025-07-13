import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import authService from "../services/authService";
import databaseService from "../services/expense";
import { login as storeLogin, setExpenses } from "../store/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const login = async (data) => {
    // setErrors("");
    try {
      const session = await authService.login(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(storeLogin(userData));
          const expenses = await databaseService.getExpenses(userData.$id);
          console.log("Fetched expenses:", expenses); // Add this
          const expensesArray = expenses.documents;
          dispatch(setExpenses(expensesArray));
        }
        navigate("/dashboard");
      } else {
        alert("Oops, looks like you do not have account");
      }
    } catch (error) {
      // setErrors(error.message);
    }
  };


  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>

        <form onSubmit={handleSubmit(login)} className="login-form">
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email", { required: "Enter valid email " })}
          />
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}
          <input
            type="password"
            placeholder="Enter your password"
            {...register("password", { required: "enter valid password" })}
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
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
