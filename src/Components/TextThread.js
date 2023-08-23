import React, { useState, useEffect } from "react"

function TextThread(props) {
    const [contacts, setContacts] = useState([]); // Initialize state with an empty array
    const [textThread, setTextThread] = useState({})
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Update contacts state when props.membersData changes
        setContacts(props.membersData);
        setTextThread(props.textThreadData)
    }, [props.membersData, props.textThreadData]); // Run the effect whenever membersData changes

    const sendMessage = async () => {
        //take message and add it to the text thread 
        // const APIService = new APIcalls({
        //     "itemID": clubData.ItemID,
        //     "itemType": "Club",
        //     "operation": "UpdateItem",
        //     "updateExpression": "SET",
        //     "currentAdmin": admin
        // })
      
        // const fetchResponse = await APIService.callQuery()
        // console.log(fetchResponse)
        
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

        {textThread && (
            <div>
                <p>{textThread.ItemID}</p>
            </div>
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
