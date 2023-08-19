import React, { useState } from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import LoginScreen from "./Components/LoginScreen";
import HomeScreen from "./Components/HomeScreen";
import CreateClubScreen from "./Components/CreateClubScreen";
import CreateAccountScreen from "./Components/CreateAccountScreen";
import WelcomeScreen from "./Components/WelcomeScreen";
import ClubHomeScreen from "./Components/ClubHomeScreen";

function App() {
  //holds {username, password}, needs to be verified once server is running
  //search db for account, if so -> pull exsisting account details
  const [userData, setUserData] = useState({});
  const [clubSelection, setClubSelection] = useState({});

  //convention: if in parent function: updateBlank, if in child: sendBlank
  const updateUserData = (userData) => {
    setUserData(userData);
    console.log(`updating user data:`)
    console.log(userData)
  };

  const updateClubSelection = (clubSelection) => {
    console.log("update club selection with: ", clubSelection)
    setClubSelection(clubSelection);
  };

  const logOut = () => {
    setUserData({})
    window.localStorage.removeItem('USER_ID')
    window.localStorage.removeItem('CLUB_ID')
    window.localStorage.removeItem('CLUB_DATA')
    window.localStorage.removeItem('MEMBERS_DATA')
    window.localStorage.removeItem('MEMBERS_ID')
  }

  return (
    <BrowserRouter>
      <div className="App">
        < div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ textAlign: 'center', margin: '0' }}>Welcome to Rabble Readers</h1>
          <p style={{ textAlign: 'right' }}>{userData.Username}</p>
          <Link to="/" onClick={logOut} style={{ marginLeft: '10px' }}>Log out</Link>
        </div>



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
            element={<HomeScreen userData={userData} updateClubSelection={updateClubSelection}/>}
          />
          <Route
            path="/createClub"
            element={<CreateClubScreen/>}
          />
          <Route
            path="/clubHome"
            element={<ClubHomeScreen clubSelection={clubSelection}/>}
          />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
