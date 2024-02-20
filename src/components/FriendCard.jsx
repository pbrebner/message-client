import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

import Button from "./Button";
import "./styles/FriendCard.css";

function FriendCard({ friend }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    const [error, setError] = useState("");

    const user = useOutletContext();
    const navigate = useNavigate();

    let online = "";
    friend.online ? (online = "online") : (online = "offline");

    // TODO: Need to recieve num channels as props
    async function createNewChannel() {
        setShowLoader(true);
        setError("");

        const formData = JSON.stringify({
            users: [friend.targetUser.name],
        });

        // Make request to create new Channel
        try {
            const response = await fetch(
                "https://message-api.fly.dev/api/channels",
                {
                    method: "post",
                    body: formData,
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

            setShowLoader(false);

            // Handle any errors
            if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            } else {
                let val = numChannels + 1;
                setNumChannels(val);
                navigate(`../channel/${result.channelId}`);
            }
        } catch (err) {
            setError(err.message);
        }
    }

    // Need to recieve number of friends as props
    async function deleteFriend() {
        setShowLoader(true);
        setError("");

        // Make request to delete friend
        try {
            const response = await fetch(
                `https://message-api.fly.dev/api/users/${user._id}/friends/${friend._id}`,
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

            setShowLoader(false);
            setModalOpen(false);

            if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            } else {
                let val = numFriends - 1;
                setNumFriends(val);
            }
        } catch (err) {
            setError(err.message);
        }
    }

    function toggleModal() {
        modalOpen ? setModalOpen(false) : setModalOpen(true);
    }

    return (
        <div className={`friendCard ${modalOpen ? "hover" : ""}`}>
            <div className="friendCardMain">
                <div className="friendCardImageContainer">
                    <img src={friend.targetUser.avatar} alt="Avatar" />
                </div>
                <div className="friendCardInfo">
                    <div className="friendName">{friend.targetUser.name}</div>
                    <dir>{online}</dir>
                </div>
            </div>
            <div className="friendCardActions">
                <Button
                    styleRef="friendCardBtn"
                    onClick={createNewChannel}
                    text="Message"
                    loading={showLoader}
                    disabled={showLoader}
                />
                <button className="friendCardBtn" onClick={toggleModal}>
                    More
                </button>
                <div
                    className={`friendCardModal ${modalOpen ? "display" : ""}`}
                >
                    <Button
                        styleRef="friendCardModalBtn deleteFriendBtn"
                        onClick={deleteFriend}
                        text="Delete"
                        loading={showLoader}
                        disabled={showLoader}
                    />
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
