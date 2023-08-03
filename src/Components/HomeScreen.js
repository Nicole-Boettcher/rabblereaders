import React from "react";
import { Link } from "react-router-dom";

function HomeScreen(props) {

  //when this page first loads, it should take the user data and fetch the profile from the db so it is saved 
  
  return (
    <div>
      <h1>Home Screen</h1>
      <p style={{ textAlign: 'right' }}>Username: {props.loginData.username}</p>
      <p style={{ textAlign: 'right' }}>Password: {props.loginData.password}</p>

      <p>Current Book Clubs:</p>
      <p>{props.clubData.name}</p>

      <Link to="/createClub">Create a New Club</Link>
    </div>
  );
}

export default HomeScreen;
