import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout as storeLogout } from "../store/userSlice";
import authService from "../services/authService";
import "./Dashboard.css";
import LoadingAnimation from "../components/LoadingAnimation";

function Dashboard() {
  // const user = useSelector((state) => state.user);
  const [user, setUser] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
     const fetchUser = async () => {
      const User = await authService.getCurrentUser();
      if (!User) {
        alert("please, log in to add expense");
        navigate("/login");
      }
      setUser(User);
      setLoading(false)
    };
    fetchUser();

  },[])

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

  if(loading){
    return(
      <LoadingAnimation />
    )
  }

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
