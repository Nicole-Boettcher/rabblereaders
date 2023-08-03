import React from "react";
import { Link } from "react-router-dom";

function HomeScreen(props) {
  return (
    <div>
      <h1>Home Screen</h1>
      <p>Username: {props.loginData.username}</p>
      <p>Password: {props.loginData.password}</p>

      <p>Current Book Clubs:</p>
      <p>{props.clubData.name}</p>

      <Link to="/createClub">Create a New Club</Link>
    </div>
  );
}

export default HomeScreen;
