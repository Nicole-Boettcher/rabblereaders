import React from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import "./WelcomeScreen.css"; // Import the CSS file

function WelcomeScreen(props) {

  useEffect(() => {
    window.localStorage.removeItem('USER_ID')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.href]);
  
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