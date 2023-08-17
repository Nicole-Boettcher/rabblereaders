import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import APIcalls from "../Utils/APIcalls";
import './ClubHomeScreen.css'

function ClubHomeScreen(props) {
  //want this page to scroll fancily 

  //1. Fetch all data about club and store it locally 

  const [clubData, setClubData] = useState("");
  const [membersData, setMembersData] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [displaySelectAdmin, setDisplaySelectAdmin] = useState(true);

  const [tabSelect, setTabSelect] = useState(1);

  useEffect(() => {
    if (clubData !== "") {
      console.log("Setting club data")
      window.localStorage.setItem('CLUB_ID', JSON.stringify(clubData.ItemID));
      window.localStorage.setItem('CLUB_DATA', JSON.stringify(clubData));
    }
    if (membersData && membersData.length !== 0) {
      console.log("Setting member data: ", membersData)
      let ids = []
      membersData.forEach((member) => {
        ids = [...ids, member.ItemID]
      })
      console.log("ids:", ids)
      window.localStorage.setItem('MEMBERS_ID', JSON.stringify(ids))
      window.localStorage.setItem('MEMBERS_DATA', JSON.stringify(membersData));
    }
  }, [clubData, membersData]);
  

  useEffect(() => {

    async function fetchClubData() {
      console.log("Call API to get club Info: ", props.clubSelection.ItemID)
    
      let id = props.clubSelection.ItemID

      if (id === undefined) {
        //need to get ID from local storage 
        console.log("grabbing id from local storage")
        const data = window.localStorage.getItem('CLUB_ID')
        id = JSON.parse(data)
      }

      const APIService = new APIcalls({
        "itemID": id,
        "itemType": "Club",
        "operation": "GetItem"
      })
      const fetchResponse = await APIService.callQuery()
      console.log("Got updated Club now:")
      console.log(fetchResponse)
      if (fetchResponse.statusCode === 200) {
         setClubData(fetchResponse.body)
      } else {
        console.log("ERROR, could not find Club by ID")
      }
    }

    async function fetchMemberData() {

      setMembersData([]) //API better work then if wiping it first

      console.log("Call API to get member Info")
    
      let members = props.clubSelection.MemberIDs

      if (members === undefined) {
        //need to get ID from local storage to update
        console.log("grabbing id from local storage")
        const data = window.localStorage.getItem('MEMBERS_ID')
        members = JSON.parse(data)  //could be sketchy...
        console.log(members)
      }

      for (let i = 0; i < members.length; i++){
        let memberID = members[i]
        const APIService = new APIcalls({
          "itemID": memberID,
          "itemType": "User",
          "operation": "GetItem"
        })
        const fetchResponse = await APIService.callQuery()
        //console.log("Fetching names of current clubs: ", fetchResponse.body)
        setMembersData(prevList => [...prevList, fetchResponse.body])
      }
    }

    fetchClubData()
    fetchMemberData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.href, displaySelectAdmin]);

  const handleDropdownChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const selectAdmin = async (adminID) => {
    console.log(adminID)
    let admin = ""
    membersData.forEach((member) => {
      if (member.ItemID == adminID){
        admin = member
      }
    })

    //add admin to the club settings THE WHOLE OBJECT -- new way of doing things
    const APIService = new APIcalls({
      "itemID": clubData.ItemID,
      "itemType": "Club",
      "operation": "UpdateItem",
      "updateExpression": "SET",
      "currentAdmin": admin
    })

    const fetchResponse = await APIService.callQuery()
    console.log(fetchResponse)

    if (fetchResponse.statusCode != 200){
      console.error("ERROR setting club invite")
    }

    setDisplaySelectAdmin(false)
  }

  const updateTabSelect = (tab) => {
    setTabSelect(tab);
  }

  const what = () => {
    
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: '0' }}>{clubData.Username}</h1>
        <ul className="tabs-container">
          <li className="tabs" onClick={() => updateTabSelect(1)}>Home</li>
          <li className="tabs" onClick={() => updateTabSelect(2)}>Book Selection</li>
          <li className="tabs" onClick={() => updateTabSelect(3)}>History</li>
          <li className="tabs" onClick={() => updateTabSelect(4)}>Members</li>
        </ul>
      </div>
 
      <p></p>

      <div className={tabSelect === 1 ? "show-content" : "content"}>


        {/* should first check if club has an admin first */}
        {!clubData.CurrentAdmin && displaySelectAdmin && (
        <div>
          <h3>Select an Admin for this Book Cycle:</h3>
          <select value={selectedValue} onChange={handleDropdownChange}>
            <option value="">Select an option</option>
            {membersData.map((member) => (
              <option key={member.ItemID} value={member.ItemID}>
                {member.Username}
              </option>
            ))}
          </select>
          {selectedValue && (<button onClick={ () => selectAdmin(selectedValue)}>Confirm {selectedValue.Username} as Admin</button>)}
        </div>
        )}

        {clubData.CurrentAdmin && <p>This cycles admin is: {clubData.CurrentAdmin.Username}</p>}


      </div>
      {/* if you are the admin you should pick the book and its details  */}
      {/* One tab should be named Book Selection and to fill out the form you must be the current admin  */}


      <div className={tabSelect === 2 ? "show-content" : "content"}>
        {clubData.CurrentAdmin && (
          <div>
            {clubData.CurrentAdmin.ItemID === JSON.parse(window.localStorage.getItem('USER_ID')) && <p>Admin can only see this</p>}
            {clubData.CurrentAdmin.ItemID !== JSON.parse(window.localStorage.getItem('USER_ID')) && <p>You do not have access to this page, only current admin does</p>}
          </div>
        )}
      </div>

      <div className={tabSelect === 3 ? "show-content" : "content"}>
        <p>Tab 3</p>
      </div>

      <div className={tabSelect === 4 ? "show-content" : "content"}>
        <p>Tab 4</p>
      </div>
    </div>
  );
}

export default ClubHomeScreen;
