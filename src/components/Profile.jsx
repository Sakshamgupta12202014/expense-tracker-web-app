import React from 'react';
import { useSelector } from 'react-redux';
import './Profile.css';

function Profile() {
  const user = useSelector((state) => state.user);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-name">{user.name}</h2>
        <p><strong>Unique USER_ID:</strong> {user.$id}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Registration Date:</strong> {new Date(user.$createdAt).toLocaleString()}</p>
        <p><strong>Status:</strong> {user.status}</p>
        <p><strong>Email Verification:</strong> {user.emailVerification ? "Verified" : "Not verified"}</p>
        <p><strong>Phone Verification:</strong> {user.phoneVerification ? "Verified" : "Not verified"}</p>
      </div>
    </div>
  );
}

export default Profile;
