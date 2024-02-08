import { useState } from "react";

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
            <div>Message Container</div>
        </div>
    );
}

export default MessageCard;
