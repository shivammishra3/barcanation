import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={require("./bnlogo.jpg")} alt="Logo" />
        </Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/videos">Videos</Link>
        </li>
        <li>
          <Link to="/podcasts">Podcasts</Link>
        </li>
        <li>
          <Link to="/news">News</Link>
        </li>
      </ul>
      <div className="nav-links">
        <li>
          <Link to="/login">Login</Link>
        </li>
      </div>
    </nav>
  );
};

export default Navbar;
