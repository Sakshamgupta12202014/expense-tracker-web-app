import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import userProfileDatabaseService from "../services/userProfile";
import "./Profile.css";
import LoadingAnimation from "../components/LoadingAnimation";

import { toast } from "react-toastify";
import defaultAvatar from "../assets/default-profile-image.png";
import databaseService from "../services/expense";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  // const [totalExpense, setTotalExpense] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const User = await authService.getCurrentUser();
      if (!User) {
        toast.error("please, log in to add expense");
        navigate("/login");
      }
      const profile = await userProfileDatabaseService.getProfile(User.$id);
      console.log("User profile:", profile);
      setUser(profile);

      // calculate total expenses
      const res = await databaseService.getExpenses(user.user_Id);
      let total = 0;
      let maxExpense = 0;
      let mostUsedCategory = "";
      let mostUsedCategoryCount = 0;
      const category = {
        "food": 0,
        "transportation": 0,
        "health": 0,
        "education": 0,
        "travel": 0,
        "bills&emi": 0,
        "entertainment": 0,
        "others": 0,
      };

      if (
        res.documents &&
        Array.isArray(res.documents) &&
        res.documents.length > 0
      ) {
        res.documents.forEach((expense) => {
          if (expense.amount > maxExpense) maxExpense = expense.amount;
          total += expense.amount;

          category[expense.category] += 1;
        });

        for (let cat in category) {
          if(category[cat] > mostUsedCategoryCount){
            mostUsedCategory = cat;
            mostUsedCategoryCount = category[cat];
          }
        }

        // update profile
        const updatedProfile = await userProfileDatabaseService.updateProfile(
          user.user_Id,
          {
            total_expenses: total,
            highest_expense_amount: maxExpense,
            most_used_category: mostUsedCategory,
          }
        );
      }
    };
    fetchUser();
    setLoading(false);
  }, []);

  const handleUpdateProfilePic = async () => {
    if (!profileImage) {
      toast.info("choose a image");
      return;
    }

    // delete the previous avatar
    if (user.profile_pic_url_id.trim() !== "") {
      // delete it first
      const isDeleted = await handleRemoveProfilePic();
      if (!isDeleted) {
        toast.error("Failed to delete old avatar");
      } else {
        toast.success("Old avatar deleted successfully");
      }
    }

    // upload to appwrite bucket
    const avatar = await userProfileDatabaseService.uploadProfilePicture(
      profileImage
    );

    if (!avatar) {
      toast.error("Failed to upload image");
      return;
    }

    toast.success("avatar uploaded successfully");

    const profile_pic_id = avatar.$id;
    const avatarUrl = userProfileDatabaseService.getProfilePicture(avatar.$id);
    if (!avatarUrl) {
      toast.error("Failed to get avatar url");
      return;
    }

    // console.log("avatarUrl", avatarUrl);

    // save the avatarUrl and its id in database
    const updatedProfile = await userProfileDatabaseService.updateProfile(
      user.user_Id,
      {
        profile_pic_url: avatarUrl,
        profile_pic_url_id: profile_pic_id,
      }
    );

    if (!updatedProfile) {
      toast.error("Failed to update user profile");
      return;
    }

    // console.log("updated user profile", updatedProfile);
    setUser(updatedProfile);
    fileInputRef.current.value = "";
    setProfileImage(null);
    return;
  };

  const handleUpdateUsername = () => {
    toast.info("Edit username clicked");
  };

  const handleRemoveProfilePic = async () => {
    // code the logic to delete the profile pic
    // delete it first
    const deleted = await userProfileDatabaseService.deleteFile(
      user.profile_pic_url_id
    );

    if (!deleted) {
      toast.error("Failed to delete profile picture");
      return;
    }

    const updatedProfile = await userProfileDatabaseService.updateProfile(
      user.user_Id,
      {
        profile_pic_url: "",
        profile_pic_url_id: "",
      }
    );

    if (updatedProfile) {
      setUser(updatedProfile);
      toast.success("Profile picture removed successfully");
      return true;
    }

    return false;
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-img-wrapper">
          {user && (
            <img
              src={user?.profile_pic_url || defaultAvatar}
              alt="Profile"
              className="profile-img"
            />
          )}
          <input
            type="file"
            id="profile-pic-input"
            ref={fileInputRef}
            onChange={(e) => {
              toast.info("Image selected");
              setProfileImage(e.target.files[0]);
            }}
          />
          <label htmlFor="profile-pic-input" className="profile-pic-label">
            Choose Photo
          </label>

          <button className="edit-btn" onClick={handleUpdateProfilePic}>
            Update Photo
          </button>
          {user?.profile_pic_url !== "" && (
            <button className="edit-btn" onClick={handleRemoveProfilePic}>
              Remove Photo
            </button>
          )}
        </div>

        <div className="profile-info">
          <h2>{user?.username}</h2>
          <p>{user?.email}</p>
          {/* <button
            className="edit-btn username-btn"
            onClick={handleUpdateUsername}
          >
            Edit Username
          </button> */}
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
