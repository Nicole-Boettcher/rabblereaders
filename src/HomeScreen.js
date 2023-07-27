import React from 'react';

function HomeScreen(props) {
  return (
    <div>
      <h1>Home Screen</h1>
      <p>Username: {props.loginData.username}</p>
      <p>Password: {props.loginData.password}</p>
    </div>
  );
};

export default HomeScreen;