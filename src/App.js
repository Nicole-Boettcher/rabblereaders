import React, { useState } from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';

function App() {

  //holds {username, password}, needs to be verified once server is running 
  //search db for account, if so -> pull exsisting account details
  const [loginData, setLoginData] = useState({}); 

  //convention: if in parent function: updateBlank, if in child: sendBlank
  const updateLoginData = (loginData) => {
    setLoginData(loginData);
  }

  return (
    <BrowserRouter>
      <div className="App">

        <h1>Welcome to Book Club</h1>

        <Routes>
          <Route exact path="/" element={<LoginScreen updateLoginData={updateLoginData}/>} />
          <Route path="/home" element={<HomeScreen loginData={loginData}/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
