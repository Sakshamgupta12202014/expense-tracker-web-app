import React from "react";
import "./Header.css";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";

function Header() {
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" , isAuth: isAuthenticated },
    { name: "Expenses", path: "/expenses" },
    { name: "Profile", path: "/profile" },
    { name: "Login", path: "/login", isAuth: !isAuthenticated },
    { name: "Logout", path: "/logout", isAuth: isAuthenticated },
    { name: "Sign Up", path: "/signup", isAuth: !isAuthenticated },
  ];

  return (
    <div className="header">
      <nav className="nav">
        <ul className="nav-list">
          {navItems.map((item) => {
            if (item.isAuth === undefined || item.isAuth === true) {
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              );
            }
            return null;
          })}
        </ul>
      </nav>
    </div>
  );
}

export default Header;
