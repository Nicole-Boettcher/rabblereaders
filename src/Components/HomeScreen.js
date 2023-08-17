import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import APIcalls from "../Utils/APIcalls";

function HomeScreen(props) {
  //when this page first loads, it should take the user data and fetch the profile from the db so it is saved
  const [userData, setUserData] = useState(""); // Use storedUserData as initial state
  const [clubDetails, setClubDetails] = useState([]);
  const [clubLinkReady, setClubLinkReady] = useState(false);

  useEffect(() => {
    if (userData !== "") {
      console.log("Set user data ID")
      window.localStorage.setItem('USER_ID', JSON.stringify(userData.ItemID));
    }
  }, [userData]);
  

  useEffect(() => {

    async function fetchData() {
      console.log("Call API to get userInfo: ", props.userData.ItemID)
    
      let id = props.userData.ItemID

      if (id === undefined) {
        //need to get ID from local storage 
        console.log("grabbing id from local storage")
        const data = window.localStorage.getItem('USER_ID')
        id = JSON.parse(data)
      }

      const APIService = new APIcalls({
        "itemID": id,
        "itemType": "User",
        "operation": "GetItem"
      })
      const fetchResponse = await APIService.callQuery()
      console.log("Get updated User now:")
      console.log(fetchResponse)
      if (fetchResponse.statusCode === 200) {
         setUserData(fetchResponse.body)
      } else {
        console.log("ERROR, could not find User by ID")
      }
    }

    fetchData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.href]);

  useEffect(() => {

    async function getClubNames() {
      setClubDetails([])
      //console.log("clear clubs: ", clubDetails)
      //console.log("userdata.Clubs length: ", userData.Clubs.length)

      for (let i = 0; i < userData.Clubs.length; i++){
        let clubID = userData.Clubs[i]
        const APIService = new APIcalls({
          "itemID": clubID,
          "itemType": "Club",
          "operation": "GetItem"
        })
        const fetchResponse = await APIService.callQuery()
        //console.log("Fetching names of current clubs: ", fetchResponse.body)

        setClubDetails(prevList => [...prevList, fetchResponse.body])
      }
    }

    if (userData.Clubs) getClubNames()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData.Clubs])

  const sendClubSelection = (club) => {
    props.updateClubSelection(club);
    setClubLinkReady(true);
  }

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
    await APIService2.callQuery()  //check its valid and worked

    //remove club invite from user
    const APIService3 = new APIcalls({
      "itemID": userData.ItemID,
      "itemType": "User",
      "clubInvite": userData.ClubInvites,
      "operation": "UpdateItem",
      "updateExpression": "REMOVE"
    })
    await APIService3.callQuery()  //check its valid and worked

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

      <ul>
        {clubDetails.map((club) => (
          <li key={club.ItemID}>
            <span >{club.Username}  </span>
            <button onClick={ () => sendClubSelection(club)}>Go To!</button>
          </li>
        ))}
      </ul>

      {clubLinkReady && <Link to="/clubHome">    Continue</Link>}

      {/* show current clubs here, need to fetch data based on the id, can use a simple key look up, need to update lambda GetItem*/}
      
      <p></p>
      <Link to="/createClub">Create a New Club</Link>
    </div>
  );
}

export default HomeScreen;
