import React from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { login } from "../store/userSlice";
import "./SignUp.css";

function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, watch } = useForm();
  const [errors, setErrors] = React.useState("");

  const password = watch("password");

  const signUp = async (data) => {
    setErrors("");
    try {
      const response = await authService.createAccount(data);
      if (response) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(login(userData));
          navigate("/");
        }
      }
    } catch (error) {
      setErrors(error.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create Account</h2>
        {errors && <p className="error-message">{errors}</p>}
        <form onSubmit={handleSubmit(signUp)} className="signup-form">
          <input
            type="text"
            placeholder="Enter your name..."
            {...register("name", { required: true })}
          />
          <input
            type="email"
            placeholder="Enter your email..."
            {...register("email", { required: true })}
          />
          <input
            type="password"
            placeholder="Type your password..."
            {...register("password", { required: true })}
          />
          <input
            type="password"
            placeholder="Confirm password..."
            {...register("confirm-password", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
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
