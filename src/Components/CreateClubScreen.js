import React, { useState } from "react";
import { Link } from "react-router-dom";

function CreateClubScreen(props) {
  const [clubName, setClubName] = useState("");
  // Will have a list of friends and have a search bar for the admin to add certain friends to the club

  const sendClubData = () => {
    props.updateClubData({ name: clubName });
  };

  return (
    <div className="container">
      <h2>Create a New Club:</h2>

      <div className="row">
        <label htmlFor="name-field">Club Name: </label>
        <input
          id="clubName-field"
          type="text"
          className="form-control"
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
        />
      </div>

      <Link to="/home" onClick={sendClubData}>
        Make Club
      </Link>
    </div>
  );
}

export default CreateClubScreen;
