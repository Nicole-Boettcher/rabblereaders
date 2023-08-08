import React, { useState } from "react";
import APIcalls from "../Utils/APIcalls";
import { Link } from "react-router-dom";
import { Button } from "bootstrap";

function CreateClubScreen(props) {
  const [clubName, setClubName] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchReponse, setSearchResponse] = useState([])
  const [invitedFriends, setInvitedFriends] = useState([])
  const [noNameFound, setNoNameFound] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)
  const [createClubSuccess, setCreateClubSuccess] = useState(false)


  // Will have a list of friends and have a search bar for the admin to add certain friends to the club

  const createClub = () => {
    console.log("about to create club")
    if (invitedFriends.length < 1 || clubName === "") {
      setErrorMessage(true)
      console.log("error")
    } else {
      setErrorMessage(false)
      props.updateClubData({ name: clubName });
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

  return (
    <div className="container">
      <h2>Create a New Club:</h2>

      <div className="row">
        <label htmlFor="clubName-field">Club Name: </label>
        <input
          id="clubName-field"
          type="text"
          className="form-control"
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
        />
        <h3>Invite people to your bookclub!</h3>
        <label htmlFor="name-field">Search by Name: </label>
        <input
          id="name-field"
          type="text"
          className="form-control"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
      </div>
      <button onClick={searchByName}>Search</button>
      {noNameFound && <p>No user found, try again</p>}

      <ul>
      {searchReponse.map((user) => (
        <li key={user.ItemID}>
          Username: {user.Username}   
          <button onClick={handleClick}>Invite friend</button>
        </li>
      ))}
      </ul>

      <h3>Invited friends:</h3>
      {invitedFriends.map((user) => (
        <li key={user.ItemID}>
          Username: {user.Username}, ID: {user.ItemID}
        </li>
      ))}

      {/* the no space before link was annoying */}
      <p></p>  
      <button onClick={createClub}>Create Club!</button>
      {createClubSuccess ? <Link to="/home">Success! Click to Continue</Link> : null}
      {errorMessage && <p>Error creating club, no name entered or no people invited</p>}

    </div>
  );
}

export default CreateClubScreen;
