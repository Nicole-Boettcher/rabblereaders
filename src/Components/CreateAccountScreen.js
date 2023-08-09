import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import APIcalls from "../Utils/APIcalls";

function CreateAccountScreen(props) {
  //const history = useHistory();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //const [response, setResponse] = useState([]);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [dataError, setDataError] = useState(false);
  const [createAccountSuccess, setCreateAccountSuccess] = useState(false);

  const sendCreateData = async () => {
    //before sending data it should check the db and see if there are any usernames that match

    const APIService = new APIcalls({
      "itemType": "User",
      "username": username,
      "password": password,
      "operation": "PutItem"
    })
    const fetchResponse = await APIService.callQuery();
    console.log("End of fetchDataFromAPI:");
    console.log(fetchResponse);

        //setResponse(data.body)
        if (fetchResponse.statusCode === 200) {
          props.updateUserData({
            "ItemType": "User",
            "Username": username,
            "Password": password
          });
          setCreateAccountSuccess(true);
        } else {
          console.error("ERROR");
          setUsername("");
          setPassword("");
        }

  };

  const validateData = async () => {
    setUsernameTaken(false);
    setDataError(false);

    if (username.length < 5 || password.length < 5) {
      setDataError(true);
      setUsername("");
      setPassword("");
    } else {
      //before sending data it should check the db and see if there are any usernames that match
    const APIService = new APIcalls({
        "itemID": "",
        "itemType": "User",
        "username": username,
        "password": password,
        "operation": "Query"
      })
      const fetchResponse = await APIService.callQuery();
      console.log("End of fetchDataFromAPI:");
      console.log(fetchResponse);

      if (fetchResponse.body.length === 0) {
        console.log("nothing found, user can use this data");
        sendCreateData();
      } else {
        console.log("taken = true");
        setUsernameTaken(true);
        setUsername("");
        setPassword("");
      }
    }
  };

  return (
    <div className="container">
      <h2>Create New Account:</h2>
      <div className="row">
        <label htmlFor="name-field">Username: </label>
        <input
          id="name-field"
          type="text"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password-field">Password: </label>
        <input
          id="password-field"
          type="text"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button onClick={validateData}>Create Account</button>
      {usernameTaken ? (
        <p>Username is taken, please enter a new username.</p>
      ) : null}
      {dataError ? (
        <p>Username and Password must be longer than 4 characters.</p>
      ) : null}
      {createAccountSuccess ? (
        <Link to="/home">Success! Click to Continue</Link>
      ) : null}

      {/* <ul>
        {response.map((user) => (
          <li key={user.ItemID}>
            Username: {user.Username}, Password: {user.Password}
          </li>
        ))}
      </ul> */}
    </div>
  );
}

export default CreateAccountScreen;
