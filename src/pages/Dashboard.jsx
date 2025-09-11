import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout as storeLogout } from "../store/userSlice";
import authService from "../services/authService";
import "./Dashboard.css";
import LoadingAnimation from "../components/LoadingAnimation";

import { toast } from "react-toastify";

import defaultAvatar from "../assets/default-profile-image.png";
import userProfileDatabaseService from "../services/userProfile.js";
import databaseService from "../services/expense.js";
import Modals from "../components/Modals.jsx";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

Chart.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  // const user = useSelector((state) => state.user);

  const [showModal, setShowModal] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [userProfile, setUserProfile] = useState();

  const [user, setUser] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [expense, setExpense] = useState([
    {
      category: "food",
      amount: 0,
    },
    {
      category: "transportation",
      amount: 0,
    },
    {
      category: "health",
      amount: 0,
    },
    {
      category: "education",
      amount: 0,
    },
    {
      category: "travel",
      amount: 0,
    },
    {
      category: "bills&emi",
      amount: 0,
    },
    {
      category: "entertainment",
      amount: 0,
    },
    {
      category: "others",
      amount: 0,
    },
  ]);

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

  useEffect(() => {
    const userProfile = async () => {
      const profile = await userProfileDatabaseService.getProfile(user.$id);
      if (!profile) {
        return;
      }
      setAvatar(profile.profile_pic_url);
      setUserProfile(profile);
    };

    userProfile();
  });

  useEffect(() => {
    const expenses = async () => {
      const response = await databaseService.getExpenses(user.$id);
      const userExpenses = response?.documents;

      if (!userExpenses) {
        return;
      }

      let newExpense = [...expense];

      for (let i = 0; i < userExpenses.length; i++) {
        let category = userExpenses[i].category;
        let amount = userExpenses[i].amount;

        const updatedExpense = newExpense.map((exp) => {
          if (exp.category == category) {
            exp.amount += amount;
          }
          return exp;
        });

        newExpense = updatedExpense;
      }

      setExpense(newExpense);
    };
    expenses();
  });

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
          <h2>Dashboard</h2>
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
            <li>
              <img src={avatar || defaultAvatar} className="profile-picture" />
            </li>
          </ul>
        </nav>

        <div className="main-container">
          <div className="show-info">
            <div className="info">
              <span className="label">Total Expense</span>
              <span className="value">₹{userProfile?.total_expenses}</span>
            </div>
            <div className="info">
              <span className="label">Total transactions</span>
              <span className="value">{userProfile?.num_transactions}</span>
            </div>
            <div className="info">
              <span className="label">Most used category</span>
              <span className="value">{userProfile?.most_used_category}</span>
            </div>
            <div className="info">
              <span className="label">Highest expense</span>
              <span className="value">
                ₹{userProfile?.highest_expense_amount}
              </span>
            </div>
          </div>

          <div className="expense-analytics">
            <h2>Expense Analytics</h2>
            <Doughnut
              data={{
                labels: expense?.map((exp) => exp.category),
                datasets: [
                  {
                    label: "Expense",
                    data: expense?.map((exp) => exp.amount),
                    backgroundColor: [
                      "#FF6384", // Color for first slice
                      "#36A2EB", // Color for second slice
                      "#FFCE56", // etc.
                      "#4BC0C0",
                      "#9966FF",
                      "#FF99CC",
                      "#C9CBCE",
                      "#A0E7E5",
                    ],
                    borderColor: [
                      "#FFF", // White border for each slice
                      "#FFF",
                      "#FFF",
                      "#FFF",
                      "#FFF",
                      "#FFF",
                      "#FFF",
                      "#FFF",
                    ],
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
