import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginScreen from "./Components/LoginScreen";
import HomeScreen from "./Components/HomeScreen";
import CreateClubScreen from "./Components/CreateClubScreen";
import CreateAccountScreen from "./Components/CreateAccountScreen";
import WelcomeScreen from "./Components/WelcomeScreen";

function App() {
  //holds {username, password}, needs to be verified once server is running
  //search db for account, if so -> pull exsisting account details
  const [userData, setUserData] = useState({});
  const [clubData, setClubData] = useState({});
  // const [IDCount, setIDCount] = useState({
  //   "user": 1,
  //   "club": 1
  // });

  //convention: if in parent function: updateBlank, if in child: sendBlank
  const updateUserData = (userData) => {
    setUserData(userData);
    console.log(`updating user data:`)
    console.log(userData)
  };

  const updateClubData = (clubData) => {
    setClubData(clubData);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <h1 style={{ textAlign: 'center' }}>Welcome to Rabble Readers</h1>

        <Routes>
          <Route
            exact
            path="/"
            element={<WelcomeScreen/>}
          />
          <Route
            exact
            path="/createAccount"
            element={<CreateAccountScreen updateUserData={updateUserData}/>}
          />
          <Route
            exact
            path="/login"
            element={<LoginScreen updateUserData={updateUserData} />}
          />
          <Route
            path="/home"
            element={<HomeScreen userData={userData} clubData={clubData} />}
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
