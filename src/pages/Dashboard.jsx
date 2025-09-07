import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout as storeLogout } from "../store/userSlice";
import authService from "../services/authService";
import "./Dashboard.css";
import LoadingAnimation from "../components/LoadingAnimation";

import { toast } from "react-toastify";

import Modals from "../components/Modals.jsx";

function Dashboard() {
  // const user = useSelector((state) => state.user);

  const [showModal, setShowModal] = useState(false);

  const [user, setUser] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const User = await authService.getCurrentUser();
      if (!User) {
        toast.error("please, log in to add expense");
        navigate("/login");
      }
      setUser(User);
      setLoading(false);
    };
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      const res = await authService.logout();
      if (res) {
        dispatch(storeLogout());
        toast.success("Successfully logged out!");
        navigate("/");
      }
    } catch (error) {
      toast.error("Failed to log out");
      console.log("Error in log out ", error);
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <>
      {showModal && (
        <Modals
          heading="Logout"
          description="Do you want to log out?"
          buttonText1="Yes"
          onButtonClick1={logout}
          closeForm={() => setShowModal(false)}
        />
      )}
      <div className="dashboard-container">
        <nav className="dashboard-nav">
          <ul className="dashboard-nav-list">
            <li className="dashboard-user">Hi, {user?.name}</li>
            <li>
              <button
                className="logout-button"
                onClick={() => setShowModal(true)}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Dashboard;
