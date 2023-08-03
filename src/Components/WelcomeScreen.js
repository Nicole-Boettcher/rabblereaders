import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

function WelcomeScreen(props) {
  return (
    <div className="container">
      <div className="row">
        <Link to="/createAccount">Create New Account</Link>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

export default WelcomeScreen;
