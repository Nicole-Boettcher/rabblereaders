import React from "react";
//import { Link } from "react-router-dom";
import { useState } from "react";

function LoginScreen(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState([]);
  const [IDCount, setIDCount] = useState(100);

  const sendLoginData = () => {
    props.updateLoginData({ username: username, password: password });

    const dataToSend = {
        "itemID": IDCount,
        "itemType": "User",
        "username": username,
        "password": password,
        "operation": "Query"
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
      .then((data) => setResponse(data.body))
      .catch((error) => console.error("Error making POST request:", error));

      console.log(response)
      setIDCount(IDCount + 1);

      
  };

  return (
    <div className="container">
      
      <h2>Login:</h2>
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

      {/* <Link to="/home" onClick={sendLoginData}>
        Enter
      </Link> */}
      <button onClick={sendLoginData}>Enter</button>

      <ul>
        {response.map((user) => (
          <li key={user.ItemID}>
            Username: {user.Username}, Password: {user.Password}
          </li>
        ))}
      </ul>

    </div>
  );
}

export default LoginScreen;
