import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function HomeScreen(props) {
  //when this page first loads, it should take the user data and fetch the profile from the db so it is saved
  const [userData, setUserData] = useState(props.userData); // Use storedUserData as initial state

  useEffect(() => {
    console.log("Getting")
    const data = window.localStorage.getItem('USER_DATA_HOME');
    if (data !== null ) setUserData(JSON.parse(data));
  }, []);

  useEffect(() => {
    console.log("Setting")
    window.localStorage.setItem('USER_DATA_HOME', JSON.stringify(userData));
  }, [userData])
  // TODO: MAKE ABOVE RELOAD ONLY WHEN PAGE IS AUTOMATICALLY REFRESHED

  // if (!userData) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div>
      <h1>Home Screen</h1>
      {userData && <p>Username: {userData.Username}</p>}
      {/* <p style={{ textAlign: 'right' }}>Password: {props.loginData.password}</p> */}

      <p>Current Book Clubs:</p>
      <p>{props.clubData.name}</p>

      <Link to="/createClub">Create a New Club</Link>
    </div>
  );
}

export default HomeScreen;
