import React from "react";
import "./Header.css";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Import icons from @fortawesome/free-solid-svg-icons for solid icons
import {
  faHome,
  faUser,
  faWallet,
  faSignInAlt, // These are solid icons
  faUserPlus, // These are solid icons
  faTachometerAlt, // This is also a solid icon
} from "@fortawesome/free-solid-svg-icons";
function Header() {
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: faHome,
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      isAuth: isAuthenticated,
      icon: faTachometerAlt,
    },
    {
      name: "Expenses",
      path: "/expenses",
      isAuth: isAuthenticated,
      icon: faWallet,
    },
    {
      name: "Profile",
      path: "/profile",
      isAuth: isAuthenticated,
      icon: faUser,
    },
    {
      name: "Login",
      path: "/login",
      isAuth: !isAuthenticated,
      icon: faSignInAlt,
    },
    {
      name: "Sign Up",
      path: "/signup",
      isAuth: !isAuthenticated,
      icon: faUserPlus,
    },
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
                    {item.icon && <FontAwesomeIcon icon={item.icon} />}
                    <span className="nav-item-name">{item.name}</span>
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
