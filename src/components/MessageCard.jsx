import { useState } from "react";

import { formatDate } from "../utils/dates.js";
import like from "../assets/icons/like.png";
import "./styles/MessageCard.css";

function MessageCard({ message, numMessages, setNumMessages }) {
    const [hover, setHover] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [messageLikes, setMessageLikes] = useState(0);

    // TODO: Set it up so only the user can delete his own messages

    async function likeMessage() {
        console.log("Liked message");
    }

    async function deleteMessage() {
        console.log("Deleting message");
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
                {message.likes > 0 && (
                    <div className="messageLikes">
                        <img src={like} />
                        <div>{message.likes}</div>
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
                <button className="messageCardModalBtn">Reply</button>
                <button
                    className="messageCardModalBtn deleteMessageBtn"
                    onClick={deleteMessage}
                >
                    Delete Message
                </button>
            </div>
            <div
                className={`overlay ${modalOpen ? "display" : ""}`}
                onClick={toggleModal}
            ></div>
        </div>
    );
}

export default MessageCard;
