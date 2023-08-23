import React, { useState, useEffect } from "react"
import APIcalls from "../Utils/APIcalls";
import './TextThread.css'

function TextThread(props) {
    const [userData, setUserData] = useState("")
    const [textThread, setTextThread] = useState({})
    const [message, setMessage] = useState("");
    const [ableToSend, setAbleToSend] = useState(false);

    useEffect(() => {
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
        setAbleToSend(false)
    }

    const refreshChat = async () => {

        console.log("before sending text, refresh chat")
        // take message and add it to the text thread 
        const APIService = new APIcalls({
            "itemID": textThread.ItemID,
            "itemType": "TextThread",
            "operation": "GetItem"
        })
      
        const fetchResponse = await APIService.callQuery()
        console.log("update chat: ", fetchResponse)
        setTextThread(fetchResponse.body)
        setAbleToSend(true)
    }


    return (
      <div className="container">
        <p>Please discuss any meeting conflicts in chat below with:</p>


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
                className={`text-bubble ${
                  text.messageDetails.user === userData.Username
                    ? "sender"
                    : "receiver"
                }`}
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

        <button onClick={refreshChat}>Refresh Chat to Send</button>

        {ableToSend && (
          <div>
            <button onClick={sendMessage}>Send</button>
          </div>
        )}
      </div>
    );
}

export default TextThread;
