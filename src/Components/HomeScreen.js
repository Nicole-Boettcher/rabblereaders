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

  const acceptClubInvite = async () => {
    //call API to add user ID to the club objects membersIDs list

    //to get clubID
    const APIService = new APIcalls({
      "itemType": "Club",
      "username": userData.ClubInvites,
      "operation": "Query"
    })
    const fetchResponse = await APIService.callQuery()
    console.log("Finding club ID response:")
    console.log(fetchResponse.body[0].ItemID)

    const clubID = fetchResponse.body[0].ItemID;

    //add member ID to club object
    const APIService2 = new APIcalls({
      "itemID": clubID,
      "itemType": "Club",
      "memberIDs": userData.ItemID,
      "operation": "UpdateItem",
      "updateExpression": "SET"
    })
    const fetchResponse2 = await APIService2.callQuery()  //check its valid and worked

    //remove club invite from user
    const APIService3 = new APIcalls({
      "itemID": userData.ItemID,
      "itemType": "User",
      "clubInvite": userData.ClubInvites,
      "operation": "UpdateItem",
      "updateExpression": "REMOVE"
    })
    const fetchResponse3 = await APIService3.callQuery()  //check its valid and worked

    console.log("gonna add club to profile")
    //add exsisting clubs to user
    const APIService4 = new APIcalls({
      "itemID": userData.ItemID,
      "itemType": "User",
      "newClub": clubID,  //add the club ID to an attribute called "clubs" under the user 
      "operation": "UpdateItem",
      "updateExpression": "SET"
    })
    const fetchResponse4 = await APIService4.callQuery()  //check its valid and worked
    setUserData(fetchResponse4.body['Attributes'])  //flow here is this calls the local state which then triggers the UseEffect which sets the local storage with the new User then calls the App.js userData 
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
      {userData.ClubInvites && <button onClick={acceptClubInvite}>Accept Club Invite</button>}

      <h3>Current Clubs:</h3>
      {/* show current clubs here, need to fetch data based on the id, can use a simple key look up, need to update lambda GetItem*/}
      

      <p></p>
      <Link to="/createClub">Create a New Club</Link>
    </div>
  );
}

export default HomeScreen;
