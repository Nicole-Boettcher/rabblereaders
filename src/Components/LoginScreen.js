import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import APIcalls from "../Utils/APIcalls";
import "./LoginScreen.css"

function LoginScreen(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    window.localStorage.removeItem('USER_ID')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.href]);

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
        props.updateUserData(fetchResponse.body[0]);
      } else {
        setLoginError(true);
      }
      //console.log(response)
  }

  return (
    <div className="container">
      <h2>Login:</h2>
      <div className="row">
        <div className="input-group">
          <label htmlFor="name-field">Username: </label>
          <input
            id="name-field"
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password-field">Password: </label>
          <input
            id="password-field"
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <button className="login-button" onClick={fetchDataFromApi}>
        Login
      </button>
      {loginSuccess ? (
        <Link className="success-link" to="/home">
          Success! Click to Continue
        </Link>
      ) : null}
      {loginError ? (
        <p className="error-message">
          Error: Username or password incorrect, please try again
        </p>
      ) : null}
    </div>
  );
}

export default LoginScreen;
