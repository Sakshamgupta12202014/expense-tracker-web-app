import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import userProfileDatabaseService from "../services/userProfile";
import "./Profile.css";
import LoadingAnimation from "../components/LoadingAnimation";

import { toast } from "react-toastify";
import defaultAvatar from "../assets/default-profile-image.png";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);

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
      setLoading(false);
    };
    fetchUser();
  }, []);


  const handleUpdateProfilePic = async () => {

    if (!profileImage) {
      toast.info("choose a image");
      return;
    }

    // delete the previous avatar
    if(user.profile_pic_url_id){
      // delete it first
      const deleted = await userProfileDatabaseService.deleteFile(user.profile_pic_url_id);
      if (!deleted) {
        toast.error("Failed to delete old avatar");
        return;
      }
      console.log("Old avatar deleted successfully");
      setProfileImage(null);
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
    // logic to open edit username form/modal
    toast.info("Edit username clicked");
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-img-wrapper">
          <img
            src={user.profile_pic_url || defaultAvatar}
            alt="Profile"
            className="profile-img"
          />
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
