import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import { UserOutlined } from "@ant-design/icons";

const Navbar = () => {
  return (
    <div className="main-div">
      <nav>
        <div className="logo">
          <Link to="/">
            <img src={require("./bnlogo.png")} alt="Logo" />
          </Link>
        </div>

        <div className="nav-links"> 
          <ul>
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
        </div>
        
        <div className="nav-login">
          <ul>
            <li>
              <Link to="/login" >L<UserOutlined/>gin</Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
