import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      const User = await authService.getCurrentUser();
      if (!User) {
        alert("please, log in to add expense");
        navigate("/login");
      }
      setUser(User);
    };
    fetchUser();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-name">{user.name}</h2>
        <p>
          <strong>Unique USER_ID:</strong> {user.$id}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Registration Date:</strong>{" "}
          {new Date(user.$createdAt).toLocaleString()}
        </p>
        <p>
          <strong>Status:</strong> {user.status}
        </p>
        <p>
          <strong>Email Verification:</strong>{" "}
          {user.emailVerification ? "Verified" : "Not verified"}
        </p>
        <p>
          <strong>Phone Verification:</strong>{" "}
          {user.phoneVerification ? "Verified" : "Not verified"}
        </p>
      </div>
    </div>
  );
}

export default Profile;
