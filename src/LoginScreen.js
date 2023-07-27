import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

function LoginScreen(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const sendLoginData = () => {
    props.updateLoginData({ username: username, password: password });
  };

  return (
    <div className="container">
      <p>Login Screen</p>

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

      <Link to="/home" onClick={sendLoginData}>
        Enter
      </Link>
    </div>
  );
}

export default LoginScreen;
