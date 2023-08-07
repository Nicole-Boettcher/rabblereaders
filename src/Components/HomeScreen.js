import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function HomeScreen(props) {
  //when this page first loads, it should take the user data and fetch the profile from the db so it is saved
  let isPageRefresh = false;
  localStorage.setItem('userData', JSON.stringify(props.userData));
  const [userData, setUserData] = useState(props.userData); // Use storedUserData as initial state

  useEffect(() => {
    
  
    const handleBeforeUnload = () => {
      isPageRefresh = true;
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  
  });

  useEffect(() => {
    console.log("invoked")
      const storedUserData = JSON.parse(localStorage.getItem('userData'));

      if (storedUserData) {
        console.log("setting data")
        console.log(storedUserData)
        setUserData(storedUserData);
      }
    
  }, [isPageRefresh])
  // TODO: MAKE ABOVE RELOAD ONLY WHEN PAGE IS AUTOMATICALLY REFRESHED

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Home Screen</h1>
      <p>Username: {userData.Username}</p>
      {/* <p style={{ textAlign: 'right' }}>Password: {props.loginData.password}</p> */}

      <p>Current Book Clubs:</p>
      <p>{props.clubData.name}</p>

      <Link to="/createClub">Create a New Club</Link>
    </div>
  );
}

export default HomeScreen;
