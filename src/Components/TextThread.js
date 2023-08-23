import React, { useState, useEffect } from "react"
import APIcalls from "../Utils/APIcalls";
import './TextThread.css'

function TextThread(props) {
    const [userData, setUserData] = useState("")
    const [contacts, setContacts] = useState([]); // Initialize state with an empty array
    const [textThread, setTextThread] = useState({})
    const [message, setMessage] = useState("");

    useEffect(() => {
        setContacts(props.membersData);
        setTextThread(props.textThreadData)
        setUserData(props.userData)
    }, [props.membersData, props.textThreadData, props.userData]); // Run the effect whenever membersData changes

    const sendMessage = async () => {

        console.log("before adding this text, current textThread: ", textThread)
        // take message and add it to the text thread 
        const APIService = new APIcalls({
            "itemID": textThread.ItemID,
            "itemType": "TextThread",
            "message": {
                "messageContent": message,
                "user": userData.Username
            },
            "operation": "UpdateItem",
            "updateExpression": "SET"
        })
      
        const fetchResponse = await APIService.callQuery()
        console.log("update the messages to include to new one: ", fetchResponse)
        setTextThread(fetchResponse.body.Attributes)
        setMessage("")
    }


    return (
      <div className="container">
        <p>Please discuss any meeting conflicts in chat form before</p>
        {/* {contacts.length > 0 && (
                <ul>
                    {contacts.map((contact) => (
                        <li key={contact.ItemID}>{contact.Username}</li>
                    ))}
                </ul>
            )} */}

        {/* it should display all previous texts and have the enter box at the bottom  */}

        {/* {textThread && userData && (
            <div>
                <p>{userData.Username}</p>
                <p>{textThread.ItemID}</p>
            </div>
        )} */}

        {/* want it to render the exsisting message before the input box and in the order they were sent  */}

        {textThread.Messages && textThread.Messages.length > 0 && (
          <ul className="message-list">
            {textThread.Messages.map((text) => (
              <li
                key={text.timeStamp}
                className={`text-bubble ${text.messageDetails.user === userData.Username ? 'sender' : 'receiver'}`}
                >
                {text.messageDetails.user}: {text.messageDetails.messageContent}
              </li>
            ))}
          </ul>
        )}

        <input
          id="text-field"
          type="text"
          className="form-control"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    );
}

export default TextThread;
