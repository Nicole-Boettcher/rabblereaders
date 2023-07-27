import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginScreen from "./LoginScreen";
import HomeScreen from "./HomeScreen";
import CreateClubScreen from "./CreateClubScreen";

function App() {
  //holds {username, password}, needs to be verified once server is running
  //search db for account, if so -> pull exsisting account details
  const [loginData, setLoginData] = useState({});
  const [clubData, setClubData] = useState({});

  //convention: if in parent function: updateBlank, if in child: sendBlank
  const updateLoginData = (loginData) => {
    setLoginData(loginData);
  };

  const updateClubData = (clubData) => {
    setClubData(clubData);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <h1>Welcome to Rabble Readers</h1>

        <Routes>
          <Route
            exact
            path="/"
            element={<LoginScreen updateLoginData={updateLoginData} />}
          />
          <Route
            path="/home"
            element={<HomeScreen loginData={loginData} clubData={clubData} />}
          />
          <Route
            path="/createClub"
            element={<CreateClubScreen updateClubData={updateClubData} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
