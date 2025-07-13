import React from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { login, setExpenses } from "../store/userSlice";
import databaseService from "../services/expense";
import "./SignUp.css";

function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  // const [errors, setErrors] = React.useState("");

  const password = watch("password");

  const signUp = async (data) => {
    // setErrors("");
    try {
      const response = await authService.createAccount(data);
      if (response) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(login(userData));
          // const expenses = await databaseService.getExpenses();
          // const expensesArray = expenses.documents;
          // dispatch(setExpenses(expensesArray));
          navigate("/dashboard");
        }
      }
    } catch (error) {
      // setErrors(error.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit(signUp)} className="signup-form">
          <input
            type="text"
            placeholder="Enter your name..."
            {...register("name", { required: "Enter valid name" })}
          />
          {errors.name && (
            <p className="error-message">{errors.name.message}</p>
          )}
          <input
            type="email"
            placeholder="Enter your email..."
            {...register("email", { required: "enter valid email" })}
          />
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}
          <input
            type="password"
            placeholder="Type your password..."
            {...register("password", { required: "enter valid password" })}
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
          <input
            type="password"
            placeholder="Confirm password..."
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p className="error-message">{errors.confirm - password.message}</p>
          )}
          <button type="submit">Register</button>
          <p className="login-text">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
