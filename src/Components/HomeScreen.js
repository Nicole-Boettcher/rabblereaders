import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import APIcalls from "../Utils/APIcalls";

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
    props.updateUserData(userData)
  }, [userData])
  // TODO: MAKE ABOVE RELOAD ONLY WHEN PAGE IS AUTOMATICALLY REFRESHED

  // if (!userData) {
  //   return <div>Loading...</div>;
  // }

  const acceptClubInvite = async () => {
    //call API to add user ID to the club objects membersIDs list
    const APIService = new APIcalls({
      "itemType": "Club",
      "username": userData.ClubInvites,
      "operation": "Query"
    })
    const fetchResponse = await APIService.callQuery()
    console.log("Finding club ID response:")
    console.log(fetchResponse.body[0].ItemID)

    const clubID = fetchResponse.body[0].ItemID;


    const APIService2 = new APIcalls({
      "itemID": clubID,
      "itemType": "Club",
      "memberIDs": userData.ItemID,
      "operation": "UpdateItem",
      "updateExpression": "SET"
    })
    const fetchResponse2 = await APIService2.callQuery()  //check its valid and worked

    //remove club invite at the end 

    const APIService3 = new APIcalls({
      "itemID": userData.ItemID,
      "itemType": "User",
      "clubInvite": userData.ClubInvites,
      "operation": "UpdateItem",
      "updateExpression": "REMOVE"
    })
    const fetchResponse3 = await APIService3.callQuery()  //check its valid and worked

  }


  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Home Screen</h1>
      {userData && <p>Username: {userData.Username}</p>}
      {/* <p style={{ textAlign: 'right' }}>Password: {props.loginData.password}</p> */}

      {/* <p>Current Book Clubs:</p>
      <p>{props.clubData.name}</p> */}

      <h3>Club Invites:</h3>
      <p>{userData.ClubInvites}</p>
      <button onClick={acceptClubInvite}>Accept Club Invite</button>

      <p></p>
      <Link to="/createClub">Create a New Club</Link>
    </div>
  );
}

export default HomeScreen;
