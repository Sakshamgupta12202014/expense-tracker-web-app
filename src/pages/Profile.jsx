import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import userProfileDatabaseService from "../services/userProfile";
import "./Profile.css";
import LoadingAnimation from "../components/LoadingAnimation";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      const User = await authService.getCurrentUser();
      if (!User) {
        alert("please, log in to add expense");
        navigate("/login");
      }
      const profile = await userProfileDatabaseService.getProfile(User.$id);
      setUser(profile);
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleUpdateProfilePic = async () => {
    
  };

  const handleUpdateUsername = () => {
    // logic to open edit username form/modal
    alert("Edit username clicked");
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-img-wrapper">
          <img
            src={user?.profile_pic_url}
            alt="Profile"
            className="profile-img"
          />
          <button className="edit-btn" onClick={handleUpdateProfilePic}>
            Update Photo
          </button>
        </div>

        <div className="profile-info">
          <h2>{user?.username}</h2>
          <p>{user?.email}</p>
          <button
            className="edit-btn username-btn"
            onClick={handleUpdateUsername}
          >
            Edit Username
          </button>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-box">
          <span className="label">Total Expenses</span>
          <span className="value">₹{user?.total_expenses}</span>
        </div>
        <div className="stat-box">
          <span className="label">Transactions</span>
          <span className="value">{user?.num_transactions}</span>
        </div>
        <div className="stat-box">
          <span className="label">Highest Expense</span>
          <span className="value">₹{user?.highest_expense_amount}</span>
        </div>
        <div className="stat-box">
          <span className="label">Most Used Category</span>
          <span className="value">{user?.most_used_category}</span>
        </div>
        <div className="stat-box">
          <span className="label">Monthly Budget</span>
          <span className="value">₹{user?.monthly_budget}</span>
        </div>
      </div>
    </div>
  );
}

export default Profile;
