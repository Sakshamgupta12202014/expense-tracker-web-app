import "./App.css";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/userSlice";
import authService from "./services/authService";
import Header from "./components/Header/Header";
import { Outlet } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(true);
  const [userFetchError, setUserFetchError] = React.useState("");

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      })
      .catch(() => {
        setUserFetchError("Error in fetching login details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return loading ? (
    <div>
      <Header />
      <div className="main-content">
        {(loading && <div>Loading...</div>) ||
          (userFetchError && <div>{userFetchError}</div>)}
        <Outlet />
      </div>
    </div>
  ) : (
    <div>
      <Header />
      <div className="main-content">
        {(loading && <div>Loading...</div>) ||
          (userFetchError && <div>{userFetchError}</div>)}
        <Outlet />
      </div>
    </div>
  );
}

export default App;

