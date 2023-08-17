import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import APIcalls from "../Utils/APIcalls";

function ClubHomeScreen(props) {
  //when this page first loads, it should take the user data and fetch the profile from the db so it is saved

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Club Home Screen</h1>
      <p>Club Name: {props.clubSelection.Username}</p>
    </div>
  );
}

export default ClubHomeScreen;
