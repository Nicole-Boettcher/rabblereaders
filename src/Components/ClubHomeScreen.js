import React from "react";
import { useEffect, useState } from "react";
import APIcalls from "../Utils/APIcalls";
import './ClubHomeScreen.css'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import TextThread from "./TextThread";


function ClubHomeScreen(props) {
  //want this page to scroll fancily 

  //1. Fetch all data about club and store it locally 
  const [userData, setUserData] = useState(""); 
  const [clubData, setClubData] = useState("");
  const [bookCycleData, setBookCycleData] = useState("");
  const [textThreadData, setTextThreadData] = useState("")
  const [membersData, setMembersData] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [displaySelectAdmin, setDisplaySelectAdmin] = useState(true);

  const [tabSelect, setTabSelect] = useState(1);

  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookGenre, setBookGenre] = useState("");
  const [bookDescription, setBookDescription] = useState("");
  const [meetingLocation, setMeetingLocation] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingDate, setMeetingDate] = useState(new Date());
  const [displayConfirmSelection, setDisplayConfirmSelection] = useState(false);


  useEffect(() => {
    if (userData !== "") {
      console.log("Set user data ID")
      window.localStorage.setItem('USER_ID', JSON.stringify(userData.ItemID));
      window.localStorage.setItem('USER_DATA', JSON.stringify(userData));
    }
  }, [userData]);

  useEffect(() => {
    if (clubData !== "") {
      console.log("Setting club data")
      window.localStorage.setItem('CLUB_ID', JSON.stringify(clubData.ItemID));
      window.localStorage.setItem('CLUB_DATA', JSON.stringify(clubData));
    }
    if (bookCycleData !== "") {
      console.log("Setting book cycle data")
      window.localStorage.setItem('BOOK_CYCLE_DATA', JSON.stringify(bookCycleData));
      console.log(bookCycleData)
    }
    if (textThreadData !== "") {
      console.log("Setting text thread data")
      window.localStorage.setItem('TEXT_THREAD_DATA', JSON.stringify(textThreadData));
      console.log(textThreadData)
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
    
  }, [clubData, membersData, bookCycleData, textThreadData]);
  

  useEffect(() => {

    async function fetchUserData() {
      console.log("Call API to get userInfo: ", props.userData.ItemID)
    
      let id = props.userData.ItemID

      if (id === undefined) {
        //need to get ID from local storage 
        console.log("grabbing id from local storage")
        const data = window.localStorage.getItem('USER_ID')
        id = JSON.parse(data)
      }

      const APIService = new APIcalls({
        "itemID": id,
        "itemType": "User",
        "operation": "GetItem"
      })
      const fetchResponse = await APIService.callQuery()
      console.log("Get updated User now:")
      console.log(fetchResponse)
      if (fetchResponse.statusCode === 200) {
         setUserData(fetchResponse.body)
      } else {
        console.log("ERROR, could not find User by ID")
      }
    }


    async function fetchClubData() {

      let id = props.clubSelection.ItemID

      if (id === undefined) {
        //need to get ID from local storage 
        console.log("grabbing id from local storage")
        const data = window.localStorage.getItem('CLUB_ID')
        id = JSON.parse(data)
      }


      console.log("Call API to get club Info: ", props.clubSelection.ItemID)

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

    fetchUserData()
    fetchClubData()
    fetchBookCycleData() 
    fetchMemberData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.href, displaySelectAdmin]);


  const fetchBookCycleData = async () => {

    let id = props.clubSelection.ItemID
    console.log("helllllo")

    if (id === undefined) {
      //need to get ID from local storage 
      console.log("grabbing id from local storage")
      const data = window.localStorage.getItem('CLUB_ID')
      id = JSON.parse(data)
      console.log("id: ", id)
    }

    const APIService = new APIcalls({
      "itemType": "BookCycle",
      "parentClubID": id,
      "operation": "Query"
    })

    const fetchResponse = await APIService.callQuery();
    console.log("Query response for book cycle based on club id:");
    console.log(fetchResponse);

    if (fetchResponse.body.length === 0) {
      console.log("No book cycle found, not created yet");
    } else {
      setBookCycleData(fetchResponse.body[0])
    }
  }

  useEffect(() => {

    const fetchTextThread = async () => {
      let id = bookCycleData.ItemID

      if (id === undefined) {
        //need to get ID from local storage 
        console.log("text thread ID problem")

      } else {
        const APIService = new APIcalls({
          "itemType": "TextThread",
          "parentClubID": id,
          "operation": "Query"
        })
    
        const fetchResponse = await APIService.callQuery();
        console.log("Query response for text thread based on book cycle id:");
        console.log(fetchResponse);
    
        if (fetchResponse.body.length === 0) {
          console.log("No text thread found, not created yet");
        } else {
          setTextThreadData(fetchResponse.body[0])
        }
      }
    }

    fetchTextThread()

  }, [bookCycleData])

  const handleDropdownChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const selectAdmin = async (adminID) => {
    console.log(adminID)
    let admin = ""
    membersData.forEach((member) => {
      if (member.ItemID === adminID){
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

    if (fetchResponse.statusCode !== 200){
      console.error("ERROR setting club invite")
    }

    setDisplaySelectAdmin(false)
  }

  const updateTabSelect = (tab) => {
    setTabSelect(tab);
  }

  const createBookDetails = async () => {

    const admin = JSON.parse(window.localStorage.getItem('CLUB_DATA')).CurrentAdmin;
    const parentClubID = JSON.parse(window.localStorage.getItem('CLUB_ID'));


    const APIServiceClub = new APIcalls({
      "itemType": "BookCycle",
      "username": bookTitle,
      "parentClubID": parentClubID,
      "bookDetails": {
        "bookTitle": bookTitle, 
        "bookAuthor": bookAuthor, 
        "bookGenre": bookGenre, 
        "bookDescription": bookDescription
      },
      "meetingDetails": {
        "meetingLocation": meetingLocation, 
        "meetingDate": meetingDate, 
        "meetingTime": meetingTime
      },
      "admin": {
        "name": admin.Username,
        "id": admin.ItemID
      },
      "operation": "PutItem"
    })
    const fetchResponse = await APIServiceClub.callQuery()
    console.log("Create new club response:")
    console.log(fetchResponse)

    const APIServiceClub2 = new APIcalls({
      "itemType": "TextThread",
      "username": bookTitle,
      "parentClubID": fetchResponse.id,
      "operation": "PutItem"
    })
    const fetchResponse2 = await APIServiceClub2.callQuery()
    console.log("Create new text thread response:")
    console.log(fetchResponse2)


    setDisplayConfirmSelection(true);
    fetchBookCycleData();
  }

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: "0" }}>{clubData.Username}</h1>
        <ul className="tabs-container">
          <li className="tabs" onClick={() => updateTabSelect(1)}>
            Home
          </li>
          <li className="tabs" onClick={() => updateTabSelect(2)}>
            Book Selection
          </li>
          <li className="tabs" onClick={() => updateTabSelect(3)}>
            History
          </li>
          <li className="tabs" onClick={() => updateTabSelect(4)}>
            Members
          </li>
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
            {selectedValue && (
              <button onClick={() => selectAdmin(selectedValue)}>
                Confirm {selectedValue.Username} as Admin
              </button>
            )}
          </div>
        )}

        {clubData.CurrentAdmin && (
          <p>This cycles admin is: {clubData.CurrentAdmin.Username}</p>
        )}

        <div>
          {bookCycleData && (
            <div>
              <h3>Book Details</h3>
              <p>Book Name: {bookCycleData.BookDetails.bookTitle}</p>
              <p>Book Author: {bookCycleData.BookDetails.bookAuthor}</p>
              <p>Book Genre: {bookCycleData.BookDetails.bookGenre}</p>
              <p>
                Book Description: {bookCycleData.BookDetails.bookDescription}
              </p>

              <h3>Meeting Details</h3>
              <p>
                Suggested Meeting Date:{" "}
                {bookCycleData.MeetingDetails.meetingDate}
              </p>
              <p>
                Suggested Meeting Time:{" "}
                {bookCycleData.MeetingDetails.meetingTime}
              </p>
              <p>
                Suggesting Meeting Location:{" "}
                {bookCycleData.MeetingDetails.meetingLocation}
              </p>

              <TextThread userData={userData} membersData={membersData} textThreadData={textThreadData}></TextThread>
            </div>
          )}
        </div>
      </div>
      {/* if you are the admin you should pick the book and its details  */}
      {/* One tab should be named Book Selection and to fill out the form you must be the current admin  */}

      <div className={tabSelect === 2 ? "show-content" : "content"}>

        {clubData.CurrentAdmin && !displayConfirmSelection && bookCycleData === "" && (
          <div>
            {clubData.CurrentAdmin.ItemID ===
              JSON.parse(window.localStorage.getItem("USER_ID")) && (
              <div>
                <h3 className="text-center">Book Details</h3>
                <div className="container">
                  <label htmlFor="title-field">Book Title: </label>
                  <input
                    id="title-field"
                    type="text"
                    className="form-control"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                  />
                  <label htmlFor="author-field">Author Name: </label>
                  <input
                    id="author-field"
                    type="text"
                    className="form-control"
                    value={bookAuthor}
                    onChange={(e) => setBookAuthor(e.target.value)}
                  />
                  <label htmlFor="genre-field">Book Genre: </label>
                  <input
                    id="genre-field"
                    type="text"
                    className="form-control"
                    value={bookGenre}
                    onChange={(e) => setBookGenre(e.target.value)}
                  />
                  <label htmlFor="description-field">Breif Description: </label>
                  <input
                    id="description-field"
                    type="text"
                    className="form-control"
                    value={bookDescription}
                    onChange={(e) => setBookDescription(e.target.value)}
                  />
                </div>

                <div className="container">
                  <h3 className="text-center">Meeting Details</h3>

                  <label htmlFor="meetingLocation-field">
                    Meeting location/Address (members home, restaurant, library,
                    etc.):{" "}
                  </label>
                  <input
                    id="meetingLocation-field"
                    type="text"
                    className="form-control"
                    value={meetingLocation}
                    onChange={(e) => setMeetingLocation(e.target.value)}
                  />

                  <p>
                    Please select a suggested date on the calander for the in
                    person book discussion. The group will have a chance to
                    review and solidify the date.
                  </p>
                  <div className="calendar-container">
                    <Calendar onChange={setMeetingDate} value={meetingDate} />
                  </div>
                  <p className="text-center">
                    <span className="bold">Suggested date: </span>{" "}
                    {meetingDate.toDateString()}
                  </p>

                  <label htmlFor="meetingTime-field">
                    Meeting time - include AM vs PM:{" "}
                  </label>
                  <input
                    id="meetingTime-field"
                    type="text"
                    className="form-control"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                  />
                </div>

                <button onClick={createBookDetails}>
                  Confirm Book Details!
                </button>
              </div>
            )}
            {clubData.CurrentAdmin.ItemID !==
              JSON.parse(window.localStorage.getItem("USER_ID")) && (
              <p>
                You do not have access to this page, only current admin does
              </p>
            )}

            {/* 
            should have a current book cycle own object, and then inside the club the id of the current book cycle 
            also inside the club, it should hold a list of previous book cycles and thats what will populate the history page  */}
          </div>
        )}

        {(bookCycleData || (clubData.CurrentAdmin && displayConfirmSelection)) && (
          <div>
            <p>
              Book Selection Complete! Now all members will be able to see{" "}
              {bookTitle} details on the 'Home' tab
            </p>
            {/* Should add edit option here */}
          </div>
        )}
      </div>

      <div className={tabSelect === 3 ? "show-content" : "content"}>
        <p>History</p>
      </div>

      <div className={tabSelect === 4 ? "show-content" : "content"}>
        <p>Order of Admins:</p>
        {membersData.length > 0 && (
          <ul>
            {membersData.map((contact) => (
              <li key={contact.ItemID}>{contact.Username}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ClubHomeScreen;
