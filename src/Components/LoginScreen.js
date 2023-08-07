import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import APIcalls from "../Utils/APIcalls";

function LoginScreen(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //const [response, setResponse] = useState({});
  const [IDCount, setIDCount] = useState(100);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const fetchDataFromApi = async () => {
    setLoginError(false);
    setLoginSuccess(false);
      console.log("calling api")
      const APIService = new APIcalls({
        "itemID": "",
        "itemType": "User",
        "username": username,
        "password": password,
        "operation": "Query"
      })
      const fetchResponse = await APIService.callQuery()
      console.log("End of fetchDataFromAPI:")
      console.log(fetchResponse)

      if (fetchResponse.body.length === 1 && fetchResponse.body[0].Password === password){
        //login data is detected and user should be logged in
        setLoginSuccess(true);
        setIDCount(IDCount + 1);
        props.updateUserData(fetchResponse.body[0]);
      } else {
        setLoginError(true);
      }
      //console.log(response)
  }

  // const sendLoginData = () => {

  //   setLoginError(false);
  //   setLoginSuccess(false);
  //   const dataToSend = {
  //       "itemType": "User",
  //       "username": username,
  //       "operation": "Query"
  //   }

  //   console.log(JSON.stringify(dataToSend))

  //   const requestOptions = {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(dataToSend),
  //   };

  //   fetch(
  //     "https://1s6o72uevg.execute-api.ca-central-1.amazonaws.com/Dev/bookclub",
  //     requestOptions
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       //setResponse(data);
  //       console.log("HERE:")
  //       console.log(data.body);
  //       console.log(JSON.stringify(data.body))
  //       if (data.body.length === 1 && data.body[0].Password === password){
  //         //login data is detected and user should be logged in
  //         setLoginSuccess(true);
  //         setIDCount(IDCount + 1);
  //         console.log(data.body[0])
  //         props.updateUserData(data.body[0]);
  //       } else {
  //         setLoginError(true);
  //       }
  //     })
  //     .catch((error) => console.error("Error making POST request:", error));

  
      
  // };

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
      <button onClick={fetchDataFromApi}>Login</button>
      {loginSuccess ? <Link to="/home">Success! Click to Continue</Link> : null}
      {loginError ? <p>Error: Username or password incorrect, please try again</p> : null}
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

export default LoginScreen;
