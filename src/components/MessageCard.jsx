import { useState } from "react";

import { formatDate } from "../utils/dates.js";
import "./styles/MessageCard.css";

function MessageCard({ message, numMessages, setNumMessages }) {
    const [messageLikes, setMessageLikes] = useState(0);

    async function likeMessage() {
        console.log("Liked message");
    }

    async function deleteMessage() {
        console.log("Deleting message");
    }

    return (
        <div className="messageCard">
            <div className="messageImage">User Image</div>
            <div className="message">
                <div className="messageHeader">
                    <div className="messageUser">{message.user.name}</div>
                    <div className="messageDate">
                        {formatDate(message.timeStamp)}
                    </div>
                </div>
                <p className="messageContents">{message.content}</p>
            </div>
        </div>
    );
}

export default MessageCard;
