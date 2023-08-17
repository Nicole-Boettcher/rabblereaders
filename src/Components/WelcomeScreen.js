import React from "react";
import { Link } from "react-router-dom";
import "./WelcomeScreen.css"; // Import the CSS file

function WelcomeScreen(props) {
  return (
    <div className="container">
      <div className="row">
        <Link to="/createAccount" className="link-button">
          Create New Account
        </Link>
        <Link to="/login" className="link-button">
          Login
        </Link>
      </div>
    </div>
  );
}

export default WelcomeScreen;