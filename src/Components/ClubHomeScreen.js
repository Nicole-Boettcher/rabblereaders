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
  const [historyData, setHistoryData] = useState("");
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

  const [discussionPoints, setDiscussionPoints] = useState("");
  const [bookCycleResetConfirmVar, setBookCycleResetConfirmVar] = useState(false)
  const [resetCycle, setResetCycle] = useState(0)



  //Use Effects for setting states
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
  }, [clubData]);

  useEffect(() => {
    if (historyData !== "") {
      console.log("Setting history data")
      window.localStorage.setItem('HISTORY_ID', JSON.stringify(historyData.ItemID));
      window.localStorage.setItem('HISTORY_DATA', JSON.stringify(historyData));
    }
  }, [historyData]);

  useEffect(() => {
    if (bookCycleData !== "") {
      console.log("Setting book cycle data")
      window.localStorage.setItem('BOOK_CYCLE_DATA', JSON.stringify(bookCycleData));
      setMeetingLocation(bookCycleData.MeetingDetails.meetingLocation);
      setMeetingDate(new Date(bookCycleData.MeetingDetails.meetingDate))
      setMeetingTime(bookCycleData.MeetingDetails.meetingTime)
      console.log(bookCycleData)
    }
  }, [bookCycleData]);

  useEffect(() => {
    if (textThreadData !== "") {
      console.log("Setting text thread data")
      window.localStorage.setItem('TEXT_THREAD_DATA', JSON.stringify(textThreadData));
      console.log(textThreadData)
    }
  }, [textThreadData]);

  useEffect(() => {
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
    
  }, [membersData]);

  //Use Effects for fetching data from API -- used to update changed data 
  useEffect(() => {

    async function fetchUserData() {    
      let id = props.userData.ItemID

      if (id === undefined) {
        //need to get ID from local storage 
        console.log("grabbing id from local storage")
        const data = window.localStorage.getItem('USER_ID')
        id = JSON.parse(data)
      }

      console.log("1. Call API to get userInfo, ID: ", props.userData.ItemID)

      const APIService = new APIcalls({
        "itemID": id,
        "itemType": "User",
        "operation": "GetItem"
      })
      const fetchResponse = await APIService.callQuery()
      console.log("UserInfo API back, updated User now:")
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


      console.log("2. Call API to get club Info, ID: ", id)

      const APIService = new APIcalls({
        "itemID": id,
        "itemType": "Club",
        "operation": "GetItem"
      })
      const fetchResponse = await APIService.callQuery()
      console.log("API back, Got updated Club now:")
      console.log(fetchResponse)
      if (fetchResponse.statusCode === 200) {
         setClubData(fetchResponse.body)
      } else {
        console.log("ERROR, could not find Club by ID")
      }
    }

    async function fetchHistoryData() {

      let id = props.clubSelection.ItemID

      if (id === undefined) {
        //need to get ID from local storage 
        console.log("grabbing id for history query from local storage")
        const data = window.localStorage.getItem('HISTORY_ID')
        id = JSON.parse(data)
      }


      console.log("3. Call API query to get history Info, ID: ", id)

      const APIService = new APIcalls({
        "itemType": "HistoryLog",
        "parentClubID": id,
        "operation": "Query"
      })

      const fetchResponse = await APIService.callQuery();
      console.log("API back, Query response for history based on club id:");
      console.log(fetchResponse);

      if (fetchResponse.body.length === 0) {
        console.log("No history found, problem");
      } else {
        setHistoryData(fetchResponse.body[0])
      }

    }

    async function fetchMemberData() {

      setMembersData([]) //API better work then if wiping it first

      console.log("4. Call API to get member Info")
    
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
    fetchHistoryData()
    fetchMemberData()
    fetchBookCycleData() 

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.href, displaySelectAdmin, resetCycle]);


  const fetchBookCycleData = async () => {

    let id = props.clubSelection.ItemID

    if (id === undefined) {
      //need to get ID from local storage 
      console.log("grabbing id from local storage")
      const data = window.localStorage.getItem('CLUB_ID')
      id = JSON.parse(data)
      console.log("id: ", id)
    }

    console.log("5. Call API query to get book cycle info, ID: ", id)

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

  }, [bookCycleData]) //after main useEffect triggers, this triggers -- dont understand how this runs before 248

  //Use Effects done ----------------------------------------

  const handleDropdownChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const selectAdmin = async (adminID) => {
    console.log(adminID)
    let admin = {}
    membersData.forEach((member) => {
      console.log("member: ", member.ItemID)
      if (member.ItemID === parseInt(adminID)){
        console.log("match")
        admin = member
      }
    })

    console.log("Admin: ", admin)
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

  const confirmMeetingDetails = async () => {

    //need up update just the meeting details of the book cycle object

    const APIServiceClub = new APIcalls({
      "itemID": bookCycleData.ItemID,
      "itemType": "BookCycle",
      "meetingDetails": {
        "meetingLocation": meetingLocation, 
        "meetingDate": meetingDate, 
        "meetingTime": meetingTime
      },
      "operation": "UpdateItem",
      "updateExpression": "SET"
    })
    const fetchResponse = await APIServiceClub.callQuery()
    console.log("Update meeting details - response:")
    console.log(fetchResponse)

    const APIServiceClub2 = new APIcalls({
      "itemID": bookCycleData.ItemID,
      "itemType": "BookCycle",
      "meetingStatus": "Confirmed",
      "operation": "UpdateItem",
      "updateExpression": "SET"
    })

    const fetchResponse2 = await APIServiceClub2.callQuery()
    console.log("Update meeting status - response:")
    console.log(fetchResponse2)

    //clear messages 

    const APIServiceClub3 = new APIcalls({
      "itemID": textThreadData.ItemID,
      "itemType": "TextThread",
      "message": "",
      "operation": "UpdateItem",
      "updateExpression": "REMOVE"
    })

    const fetchResponse3 = await APIServiceClub3.callQuery()
    console.log("Clear messages - response:")
    console.log(fetchResponse3)

    fetchBookCycleData();
  }

  const sendDiscussionPoints = async () => {
    //add discussionPoints to bookcycle object 

    console.log("discussion points: ", discussionPoints)
    const APIServiceClub = new APIcalls({
      "itemID": bookCycleData.ItemID,
      "itemType": "BookCycle",
      "discussionPoints": discussionPoints,
      "operation": "UpdateItem",
      "updateExpression": "SET"
    })

    const fetchResponse = await APIServiceClub.callQuery()
    console.log("Update discussion points - response:")
    console.log(fetchResponse)

    fetchBookCycleData();
  }

  const bookCycleReset = () => {
    setBookCycleResetConfirmVar(true)
  }

  const bookCycleResetConfirm = async () => {

    //THIS WORKS AS EXPECTED 

    //1. Delete text thread object
    //1. roll bookcycle over to history
    //2. Delete the original object of bookcycle
    //3. Delete current admin from club object
    //4. Redo whole page

    console.log("text thread ID: ", textThreadData.ItemID)
    const APIServiceText = new APIcalls({
      "itemID": textThreadData.ItemID,
      "itemType": "TextThread",
      "operation": "DeleteItem"
    })
    const fetchResponse = await APIServiceText.callQuery()
    console.log("delete text thread: ", fetchResponse)

    //roll book cycle over to history

    console.log("add book cycle to history")
    console.log("historyData.ItemID: ", historyData.ItemID)
    const APIServiceHistory = new APIcalls({
        "itemID": historyData.ItemID,
        "itemType": "HistoryLog",
        "bookLog": bookCycleData,
        "operation": "UpdateItem",
        "updateExpression": "SET"
    })
      
    const fetchResponseHistory = await APIServiceHistory.callQuery()
    console.log("add to history: ", fetchResponseHistory)

    //delete book cycle -- might not be nessasary
    const APIServiceBookCycle = new APIcalls({
      "itemID": bookCycleData.ItemID,
      "itemType": "BookCycle",
      "operation": "DeleteItem"
    })
    const fetchResponse2 = await APIServiceBookCycle.callQuery()
    console.log("delete book cycle: ", fetchResponse2)


    //remove current admin from club
    const APIServiceAdmin = new APIcalls({
      "itemID": clubData.ItemID,
      "itemType": "Club",
      "currentAdmin": "",
      "operation": "UpdateItem",
      "updateExpression": "REMOVE"
    })
    const fetchResponse3 = await APIServiceAdmin.callQuery()
    console.log("delete club current admin: ", fetchResponse3)

    window.localStorage.removeItem('BOOK_CYCLE_ID')
    window.localStorage.removeItem('BOOK_CYCLE_DATA')
    window.localStorage.removeItem('TEXT_THREAD_DATA')

    setBookCycleData("");
    setTextThreadData("");
    setDisplaySelectAdmin(true)
    setDisplayConfirmSelection(false)
    setSelectedValue('')
    setBookCycleResetConfirmVar(false)

    setBookTitle("");
    setBookAuthor("");
    setBookGenre("");
    setBookDescription("");
    setMeetingLocation("");
    setMeetingTime("");
    setMeetingDate(new Date());
    setDiscussionPoints("");

    setResetCycle(resetCycle+1)
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
            Admin Duties
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
              <div className="container">
                <h3>Book Details</h3>
                <p>Book Name: {bookCycleData.BookDetails.bookTitle}</p>
                <p>Book Author: {bookCycleData.BookDetails.bookAuthor}</p>
                <p>Book Genre: {bookCycleData.BookDetails.bookGenre}</p>
                <p>
                  Book Description: {bookCycleData.BookDetails.bookDescription}
                </p>

                {bookCycleData.MeetingStatus === "Review" && (
                  <div>
                    <h3>SUGGESTED Meeting Details</h3>
                  </div>
                )}
                {bookCycleData.MeetingStatus === "Confirmed" && (
                  <div>
                    <h3>CONFIRMED Meeting Details</h3>
                  </div>
                )}

                <p>
                  <p className="text-center">
                    <span>Meeting Date: </span>{" "}
                    {new Date(
                      bookCycleData.MeetingDetails.meetingDate
                    ).toDateString()}
                  </p>

                  <div className="calendar-container">
                    <Calendar
                      value={bookCycleData.MeetingDetails.meetingDate}
                    />
                  </div>
                </p>
                <p>Meeting Time: {bookCycleData.MeetingDetails.meetingTime}</p>
                <p>
                  Meeting Location:{" "}
                  {bookCycleData.MeetingDetails.meetingLocation}
                </p>
              </div>

              {/* make this bold and stand out */}

              {bookCycleData.MeetingStatus === "Review" && (
                <div>
                  <p>
                    Please use the chat below to discuss any conflicts in the
                    suggest meeting details. Once group comes to a concenus, the
                    admin will soildify details
                  </p>
                </div>
              )}
              {bookCycleData.MeetingStatus === "Confirmed" && (
                <div>
                  <p className="bold">
                    Discuss below any meeting details (rides, food, attire,
                    etc.)
                  </p>
                </div>
              )}

              <TextThread
                userData={userData}
                membersData={membersData}
                textThreadData={textThreadData}
              ></TextThread>

              {/* Admin needs to confirm meeting details */}

              {/* {parseInt(clubData.CurrentAdmin.ItemID) ===
                parseInt(JSON.parse(window.localStorage.getItem("USER_ID"))) &&
                bookCycleData.MeetingStatus === "Review" && (
                  <p>
                    {clubData.CurrentAdmin.Username} - Once the group has
                    decided on meeting details, please confirm in Book/Meeting
                    Details
                  </p>
                )} */}

              {bookCycleData.DiscussionPoints && (
                <div className="container">
                  <h3>Discussion Points</h3>
                  <p>{bookCycleData.DiscussionPoints}</p>

                  <button onClick={bookCycleReset}>
                    In person meeting complete! Ready for new book
                  </button>
                  {bookCycleResetConfirmVar && (
                    <div>
                      <button onClick={bookCycleResetConfirm}>
                        Confirm -- all above details will vanish
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* if you are the admin you should pick the book and its details  */}
      {/* One tab should be named Book Selection and to fill out the form you must be the current admin  */}

      <div className={tabSelect === 2 ? "show-content" : "content"}>
        {clubData.CurrentAdmin &&
          !displayConfirmSelection &&
          !bookCycleData && (
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
                    <label htmlFor="description-field">
                      Breif Description:{" "}
                    </label>
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
                      Meeting location/Address (members home, restaurant,
                      library, etc.):{" "}
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

        {clubData.CurrentAdmin && displayConfirmSelection && (
          <div>
            <p>
              Book Selection Complete! Now all members will be able to see{" "}
              {bookTitle} details on the 'Home' tab
            </p>
            {/* Should add edit option here */}
          </div>
        )}

        {clubData.CurrentAdmin && clubData.CurrentAdmin.ItemID ===
            JSON.parse(window.localStorage.getItem("USER_ID")) &&
          bookCycleData &&
          bookCycleData.MeetingStatus === "Review" && (
            <div>
              <p>Edit book details -- in dev</p>
              <h3 className="text-center">Confirm Meeting Details</h3>

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

              <p>Meeting Date:</p>
              <div className="calendar-container">
                <Calendar onChange={setMeetingDate} value={meetingDate} />
              </div>
              <p className="text-center">
                <span className="bold">Selected date: </span>{" "}
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

              <button onClick={confirmMeetingDetails}>
                Final Confirmation on Meeting Details!
              </button>
            </div>
          )}

        {bookCycleData.MeetingStatus === "Confirmed" && clubData.CurrentAdmin &&
          clubData.CurrentAdmin.ItemID ===
            JSON.parse(window.localStorage.getItem("USER_ID")) &&
          !bookCycleData.DiscussionPoints && (
            <div>
              <p>Meeting Details Confirmed</p>

              <h3>
                Please enter any discussion points you want the group to think
                about before you meet!
              </h3>
              <input
                id="discussionPoints-field"
                type="text"
                className="form-control"
                value={discussionPoints}
                onChange={(e) => setDiscussionPoints(e.target.value)}
              />
              <button onClick={sendDiscussionPoints}>Send to Group</button>
            </div>
          )}
      </div>

      <div className={tabSelect === 3 ? "show-content" : "content"}>
        <p>History</p>
        {historyData.BookLog && (
          <div>
            <table>
              <thead>
                <tr>
                  <th>Book Name </th>
                  <th>Author</th>
                  <th>Genre</th>
                </tr>
              </thead>
              <tbody>
                {historyData.BookLog.map((book, index) => (
                  <tr key={index}>
                    <td>{book.BookDetails.bookTitle}</td>
                    <td>{book.BookDetails.bookAuthor}</td>
                    <td>{book.BookDetails.bookGenre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
