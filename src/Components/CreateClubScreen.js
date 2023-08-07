import React, { useState } from "react";
import { Link } from "react-router-dom";

function CreateClubScreen(props) {
  const [clubName, setClubName] = useState("");
  const [searchName, setSearchName] = useState("");

  // Will have a list of friends and have a search bar for the admin to add certain friends to the club

  const sendClubData = () => {
    props.updateClubData({ name: clubName });
  };

  const searchByName = () => {
    
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

      {/* the no space before link was annoying */}
      <p></p>  
      <Link to="/home" onClick={sendClubData} >
        Make Club
      </Link>
    </div>
  );
}

export default CreateClubScreen;
