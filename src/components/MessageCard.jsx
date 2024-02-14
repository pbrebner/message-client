import { useState } from "react";

import { formatDate } from "../utils/dates.js";
import like from "../assets/icons/like.png";
import "./styles/MessageCard.css";

function MessageCard({ channelId, message, numMessages, setNumMessages }) {
    const [hover, setHover] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [messageLikes, setMessageLikes] = useState(message.likes);

    const userId = localStorage.getItem("userId");

    const [error, setError] = useState("");

    async function likeMessage() {
        let likes = messageLikes + 1;
        setMessageLikes(likes);

        setError("");

        const bodyData = JSON.stringify({
            likes: likes,
        });

        // Make request to update message likes
        try {
            const response = await fetch(
                `https://message-api.fly.dev/api/channels/${channelId}/messages/${message._id}`,
                {
                    method: "put",
                    body: bodyData,
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            const result = await response.json();
            console.log(result);

            if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            }
        } catch (err) {
            setError(err.message);
        }
    }

    async function deleteMessage() {
        setError("");

        // Make request to delete message
        try {
            const response = await fetch(
                `https://message-api.fly.dev/api/channels/${channelId}/messages/${message._id}`,
                {
                    method: "delete",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            const result = await response.json();
            console.log(result);

            toggleModal();

            if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            } else {
                let val = numMessages - 1;
                setNumMessages(val);
            }
        } catch (err) {
            setError(err.message);
        }
    }

    // Currently not possible with API
    async function replyMessage() {
        console.log("Replying to message");
    }

    function toggleModal() {
        modalOpen ? setModalOpen(false) : setModalOpen(true);
    }

    return (
        <div
            className={`messageCard ${hover || modalOpen ? "hover" : ""}`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="messageImageContainer">
                <img
                    src={message.user.avatar}
                    alt="User"
                    className="messageImage"
                />
            </div>
            <div className="message">
                <div className="messageHeader">
                    <div className="messageUser">{message.user.name}</div>
                    <div className="messageDate">
                        {formatDate(message.timeStamp)}
                    </div>
                </div>
                <p className="messageContents">{message.content}</p>
                {messageLikes > 0 && (
                    <div className="messageLikes">
                        <img src={like} />
                        <div>{messageLikes}</div>
                    </div>
                )}
            </div>
            <div
                className={`messageCardBtns ${
                    hover || modalOpen ? "display" : ""
                }`}
            >
                <button className="reactBtn" onClick={likeMessage} title="Like">
                    <img src={like} />
                </button>
                <button className="moreBtn" onClick={toggleModal} title="More">
                    &#8230;{" "}
                </button>
            </div>
            <div className={`messageCardModal ${modalOpen ? "display" : ""}`}>
                <button className="messageCardModalBtn" onClick={replyMessage}>
                    Reply
                </button>
                {message.user._id == userId && (
                    <button
                        className="messageCardModalBtn deleteMessageBtn"
                        onClick={deleteMessage}
                    >
                        Delete Message
                    </button>
                )}
            </div>
            <div
                className={`overlay ${modalOpen ? "display" : ""}`}
                onClick={toggleModal}
            ></div>
        </div>
    );
}

export default MessageCard;
