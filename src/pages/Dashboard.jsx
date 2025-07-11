import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout as storeLogout } from "../store/userSlice";
import authService from "../services/authService";
import "./Dashboard.css";

function Dashboard() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const res = await authService.logout();
      if (res) {
        dispatch(storeLogout());
        alert("Successfully logged out!");
        navigate("/");
      }
    } catch (error) {
      console.log("Error in log out ", error);
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <ul className="dashboard-nav-list">
          <li className="dashboard-user">Hi, {user?.name}</li>
          <li>
            <button className="logout-button" onClick={logout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Dashboard;
