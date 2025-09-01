import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import imageUrl from "/assets/images/avatar-icon.png";
import { useAuth } from "../contexts/AuthContext";
import { logoutUser } from "../api";

export default function Header() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const activeStyles = {
    fontWeight: "bold",
    textDecoration: "underline",
    color: "#161616",
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    const { error } = await logoutUser();
    if (error) {
      console.error("Failed to logout:", error);
    }
  }

  return (
    <header>
      <Link className="site-logo" to="/">
        #VanLife
      </Link>
      <nav className="navbar">
        <NavLink
          to="/host"
          style={({ isActive }) => (isActive ? activeStyles : null)}
        >
          Host
        </NavLink>
        <NavLink
          to="/about"
          style={({ isActive }) => (isActive ? activeStyles : null)}
        >
          About
        </NavLink>
        <NavLink
          to="/vans"
          style={({ isActive }) => (isActive ? activeStyles : null)}
        >
          Vans
        </NavLink>
        {/* {user ? (
          <>
            <Link to="/host" className="login-link">
              <img src={imageUrl} className="login-icon" />
            </Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="login" className="login-link">
            <img src={imageUrl} className="login-icon" />
          </Link>
        )} */}
        {user ? (
          <div className="user-profile" ref={menuRef}>
            <button
              className="avatar-button"
              title={user.email}
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <img src={imageUrl} className="login-icon" alt="User avatar" />
            </button>
            {isMenuOpen && (
              <div className="dropdown-menu">
                <Link to="/host" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/host/income" onClick={() => setIsMenuOpen(false)}>
                  Income
                </Link>
                <Link to="/host/vans" onClick={() => setIsMenuOpen(false)}>
                  Vans
                </Link>
                <Link to="/host/reviews" onClick={() => setIsMenuOpen(false)}>
                  Reviews
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="login" className="login-link">
            <img src={imageUrl} className="login-icon" alt="Login" />
          </Link>
        )}
      </nav>
    </header>
  );
}
