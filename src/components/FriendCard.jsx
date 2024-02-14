import { useState } from "react";

import "./styles/FriendCard.css";

function FriendCard({ friend }) {
    const [modalOpen, setModalOpen] = useState(false);

    const [error, setError] = useState("");

    let online = "";
    friend.online ? (online = "online") : (online = "offline");

    async function createNewChannel() {
        console.log("Creating new channel");
    }

    async function deleteFriend() {
        console.log("Deleteing Friend");
    }

    function toggleModal() {
        modalOpen ? setModalOpen(false) : setModalOpen(true);
    }

    return (
        <div className={`friendCard ${modalOpen ? "hover" : ""}`}>
            <div className="friendCardMain">
                <div className="friendCardImageContainer">
                    <img src={friend.avatar} alt="Avatar" />
                </div>
                <div className="friendCardInfo">
                    <div className="friendName">{friend.name}</div>
                    <dir>{online}</dir>
                </div>
            </div>
            <div className="friendCardActions">
                <button className="friendCardBtn" onClick={createNewChannel}>
                    Message
                </button>
                <button className="friendCardBtn" onClick={toggleModal}>
                    More
                </button>
                <div
                    className={`friendCardModal ${modalOpen ? "display" : ""}`}
                >
                    <button
                        className="friendCardModalBtn deleteFriendBtn"
                        onClick={deleteFriend}
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div
                className={`overlay ${modalOpen ? "display" : ""}`}
                onClick={toggleModal}
            ></div>
        </div>
    );
}

export default FriendCard;
