import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { useDispatch } from "react-redux";
import { login, setExpenses } from "../store/userSlice";
import databaseService from "../services/expense";
import userProfileDatabaseService from "../services/userProfile";
import "./SignUp.css";

import LoadingAnimation from "../components/LoadingAnimation";
import { toast } from "react-toastify";

function SignUp() {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [registerDetails, setRegisterDetails] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleChange = (e) => {
    setRegisterDetails({
      ...registerDetails,
      [e.target.name]: e.target.value,
    });
  };

  const signUp = async (e) => {
    e.preventDefault();

    if (
      registerDetails.email === "" ||
      registerDetails.password.trim() === "" ||
      registerDetails.name.trim() === ""
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.createAccount({
        email: registerDetails.email,
        password: registerDetails.password,
        name: registerDetails.name,
      });
      if (response) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          // const profileFields = {
          //   username: "username",
          //   email: userData.email,
          //   profile_pic_url: "",
          //   total_expenses: 0,
          //   num_transactions: 0,
          //   highest_expense_amount: 0,
          //   most_used_category: "",
          //   monthly_budget: "",
          //   profile_pic_url_id: "",
          // };
          // set user profile also
          const userProfile = await userProfileDatabaseService.addProfileData(
            userData.$id,
            {
              email: userData.email,
              username: userData.name,
              profile_pic_url: "",
              total_expenses: 0,
              num_transactions: 0,
              highest_expense_amount: 0,
              most_used_category: "",
              monthly_budget: "0",
              profile_pic_url_id: "",
            }
          );
          console.log("Profile data added: ", userProfile);
          dispatch(login(userData));
          // const expenses = await databaseService.getExpenses();
          // const expensesArray = expenses.documents;
          // dispatch(setExpenses(expensesArray));
          toast.success("User registeration successful");
          navigate("/dashboard");
        }
      } else {
        toast.error("Account could not be created. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error); // helpful in dev
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create Account</h2>

        <form onSubmit={signUp} className="signup-form">
          <input
            name="name"
            type="text"
            placeholder="Enter your name..."
            value={registerDetails.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Enter your email..."
            value={registerDetails.email}
            onChange={handleChange}
          />

          <input
            type="password"
            placeholder="Type your password..."
            name="password"
            value={registerDetails.password}
            onChange={handleChange}
          />

          {/* <input type="password" placeholder="Confirm password..." /> */}

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
