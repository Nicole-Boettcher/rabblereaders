import React from "react";
import { Link } from 'react-router-dom';
import { useState } from "react";

function CreateAccountScreen(props) {

  //const history = useHistory();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //const [response, setResponse] = useState([]);
  const [IDCount, setIDCount] = useState(6);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [dataError, setDataError] = useState(false);
  const [createAccountSuccess, setCreateAccountSuccess] = useState(false);


  const sendCreateData = () => {

    //before sending data it should check the db and see if there are any usernames that match

    const dataToSend = {
        "itemID": IDCount,
        "itemType": "User",
        "username": username,
        "password": password,
        "operation": "PutItem"
    }

    console.log(dataToSend);
    console.log(JSON.stringify(dataToSend))

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    };

    fetch(
      "https://1s6o72uevg.execute-api.ca-central-1.amazonaws.com/Dev/bookclub",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        //setResponse(data.body)
        if (data.statusCode === 200){
          props.updateLoginData({ username: username, password: password });
          setIDCount(IDCount + 1);
          setCreateAccountSuccess(true);
        } else {
          console.error("ERROR");
          setUsername("");
          setPassword("");
        }
      })
      .catch((error) => console.error("Error making POST request:", error));

  };

  const validateData = () => {
    setUsernameTaken(false);
    setDataError(false);

    if (username.length < 5 || password.length < 5){
      setDataError(true);
      setUsername("");
      setPassword("");
    } else {
    //before sending data it should check the db and see if there are any usernames that match
    const dataToSend = {
        "itemType": "User",
        "username": username,
        "operation": "Query"
    }

    console.log(JSON.stringify(dataToSend))

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    };

    fetch(
      "https://1s6o72uevg.execute-api.ca-central-1.amazonaws.com/Dev/bookclub",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        //setResponse(data.body)
        console.log(data.body)

        if (data.body.length === 0){
          console.log("nothing found, user can use this data")
          sendCreateData();
        } else {
          console.log("taken = true")
          setUsernameTaken(true);
          setUsername("");
          setPassword("");
        }
      })
      .catch((error) => console.error("Error making POST request:", error));

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
      {usernameTaken ? <p>Username is taken, please enter a new username.</p> : null}
      {dataError ? <p>Username and Password must be longer than 4 characters.</p> : null}
      {createAccountSuccess ? <Link to="/home">Success! Click to Continue</Link> : null}

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
