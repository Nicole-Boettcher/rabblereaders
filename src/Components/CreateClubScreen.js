import React, { useState } from "react";
import APIcalls from "../Utils/APIcalls";
import { Link } from "react-router-dom";
import './CreateClubScreen.css';
import womanReading from "./woman1.png";

function CreateClubScreen(props) {
  const [clubName, setClubName] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchReponse, setSearchResponse] = useState([])
  const [invitedFriends, setInvitedFriends] = useState([])
  const [noNameFound, setNoNameFound] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)
  const [createClubSuccess, setCreateClubSuccess] = useState(false)

  const createClub = async () => {
    console.log("about to create club")
    if (invitedFriends.length < 1 || clubName === "") {
      setErrorMessage(true)
      console.log("error")
    } else {
      //call API for each user in the invited list and add an invite to their properties
      //TODO: overwrites last club invite, make it so it creates a list
      for (let i = 0; i < invitedFriends.length; i++){
        let friend = invitedFriends[i]
        const APIService = new APIcalls({
          "itemID": friend.ItemID,
          "itemType": "User",
          "username": friend.Username,
          "password": friend.Password,
          "operation": "UpdateItem",
          "updateExpression": "SET",
          "clubInvite": clubName
        })
        const fetchResponse = await APIService.callQuery()
        console.log("Search response:")
        console.log(fetchResponse)

        if (fetchResponse.statusCode != 200){
          console.error("ERROR setting club invite")
        }
      }

      //create new club object - properties: name (username), admin, members, pending members 

      console.log(props.userData.Username)
      const APIServiceClub = new APIcalls({
        "itemType": "Club",
        "username": clubName,
        "admin": props.userData.ItemID,
        "operation": "PutItem"
      })
      const fetchResponse = await APIServiceClub.callQuery()
      console.log("Create new club response:")
      console.log(fetchResponse)

      //add admin as a member to the club
      const APIServiceClub2 = new APIcalls({
        "itemID": fetchResponse.id, //right not manually returning the id, could change it to the updateItem way of returning the whole objects attributes 
        "itemType": "Club",
        "memberIDs": props.userData.ItemID,
        "operation": "UpdateItem",
        "updateExpression": "SET"
      })
      await APIServiceClub2.callQuery()

      //add club name to user profile?

      const APIService3 = new APIcalls({
        "itemID": props.userData.ItemID,
        "itemType": "User",
        "newClub": fetchResponse.id,  //add the club ID to an attribute called "clubs" under the user 
        "operation": "UpdateItem",
        "updateExpression": "SET"
      })
      const fetchResponse3 = await APIService3.callQuery()  //check its valid and worked

      setErrorMessage(false)
      setCreateClubSuccess(true)
    }
  }

  const handleClick = () => {
    console.log("About to add ", searchName, " to invited list  response: ", searchReponse[0])
    setInvitedFriends(prevList => [...prevList, searchReponse[0]])
    setSearchName("")
    setSearchResponse([])
  };

  const searchByName = async () => {
    setNoNameFound(false)
    const APIService = new APIcalls({
      "itemID": "",
      "itemType": "User",
      "username": searchName,
      "password": "",
      "operation": "Query"
    })
    const fetchResponse = await APIService.callQuery()
    console.log("Search response:")
    console.log(fetchResponse)
    if (fetchResponse.body.length === 1) {
       setSearchResponse(fetchResponse.body)
    } else {
      console.log("no name found")
      setNoNameFound(true)
    }

  };

  // const updateUserData = async () => {
  //   const APIService = new APIcalls({
  //     "itemID": props.userData.ItemID,
  //     "itemType": "User",
  //     "operation": "GetItem"
  //   })
  //   const fetchResponse = await APIService.callQuery()
  //   console.log("Get updated User now:")
  //   console.log(fetchResponse)
  //   if (fetchResponse.statusCode === 200) {
  //      props.updateUserData(fetchResponse.body)
  //   } else {
  //     console.log("ERROR, could not find User by ID")
  //   }

  // };

  return (
    <div className="container">
      <h2 className="title">Create a New Club:</h2>
  
      <div className="row form-group">
        <label htmlFor="clubName-field">Club Name: </label>
        <input
          id="clubName-field"
          type="text"
          className="form-control"
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
        />
      </div>
  
      <h3 className="title invite-section">Invite people to your bookclub!</h3>
      <div className="row form-group">
        <label htmlFor="name-field">Search by Name: </label>
        <input
          id="name-field"
          type="text"
          className="form-control"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
      </div>
      <button className="search-button" onClick={searchByName}>Search</button>
      {noNameFound && <p className="error-text">No user found, try again</p>}
  
      <ul className="user-list">
        {searchReponse.map((user) => (
          <li className="user-item" key={user.ItemID}>
            <span className="username">Username: {user.Username}</span>
            <button className="invite-button" onClick={handleClick}>Invite friend</button>
          </li>
        ))}
      </ul>
  
      <h3 className="title">Invited friends:</h3>
      <ul className="invited-list">
        {invitedFriends.map((user) => (
          <li className="invited-item" key={user.ItemID}>
            <span className="username">Username: {user.Username}</span>
            <span className="user-id">ID: {user.ItemID}</span>
          </li>
        ))}
      </ul>
  
      {/* Add some spacing */}
      <p></p>
  
      <button className="create-button" onClick={createClub}>Create Club!</button>
      {createClubSuccess && <Link className="success-link" to="/home">Success! Click to Continue</Link>}
      {errorMessage && <p className="error-text">Error creating club, no name entered or no people invited</p>}


      <div className="cartoon-images">
        {/* <img src="woman1.png" alt="Cartoon Woman 1" /> */}
        <img src={womanReading} alt="Cartoon Woman 2" />
      </div>

    </div>
  );
  
  // return (
  //   <div className="container">
  //     <h2>Create a New Club:</h2>

  //     <div className="row">
  //       <label htmlFor="clubName-field">Club Name: </label>
  //       <input
  //         id="clubName-field"
  //         type="text"
  //         className="form-control"
  //         value={clubName}
  //         onChange={(e) => setClubName(e.target.value)}
  //       />
  //       <h3>Invite people to your bookclub!</h3>
  //       <label htmlFor="name-field">Search by Name: </label>
  //       <input
  //         id="name-field"
  //         type="text"
  //         className="form-control"
  //         value={searchName}
  //         onChange={(e) => setSearchName(e.target.value)}
  //       />
  //     </div>
  //     <button className="search-button" onClick={searchByName}>Search</button>
  //     {noNameFound && <p>No user found, try again</p>}

  //     <ul>
  //     {searchReponse.map((user) => (
  //       <li key={user.ItemID}>
  //         Username: {user.Username}   
  //         <button onClick={handleClick}>Invite friend</button>
  //       </li>
  //     ))}
  //     </ul>

  //     <h3>Invited friends:</h3>
  //     {invitedFriends.map((user) => (
  //       <li key={user.ItemID}>
  //         Username: {user.Username}, ID: {user.ItemID}
  //       </li>
  //     ))}

  //     {/* the no space before link was annoying */}
  //     <p></p>  
  //     <button className="create-button" onClick={createClub}>Create Club!</button>
  //     {createClubSuccess ? <Link to="/home">Success! Click to Continue</Link> : null}
  //     {errorMessage && <p>Error creating club, no name entered or no people invited</p>}

  //   </div>
  // );
}

export default CreateClubScreen;
