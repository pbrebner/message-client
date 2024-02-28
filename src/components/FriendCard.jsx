import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

import Button from "./Button";
import "./styles/FriendCard.css";

function FriendCard({ friend, numFriends, setNumFriends }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    const [
        user,
        numChannels,
        setNumChannels,
        updateChannel,
        setUpdateChannel,
        setError,
    ] = useOutletContext();
    const navigate = useNavigate();

    let online = "";
    friend.online ? (online = "online") : (online = "offline");

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
                if (result.newChannel) {
                    let val = numChannels + 1;
                    setNumChannels(val);
                }
                navigate(`/message-client/channels/${result.channelId}`);
            }
        } catch (err) {
            setError(err.message);
            setShowLoader(false);
        }
    }

    async function acceptFriendRequest() {
        setShowLoader(true);
        setError("");

        // Make request to update Friend
        try {
            const response = await fetch(
                `https://message-api.fly.dev/api/users/${user._id}/friends/${friend._id}`,
                {
                    method: "put",
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

            if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            } else {
                let val = numFriends + 1;
                setNumFriends(val);
            }
        } catch (err) {
            setError(err.message);
            setShowLoader(false);
        }
    }

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
                let val2 = updateChannel + 1;
                setUpdateChannel(val2);
            }
        } catch (err) {
            setError(err.message);
            setShowLoader(false);
            setModalOpen(false);
        }
    }

    function toggleModal() {
        modalOpen ? setModalOpen(false) : setModalOpen(true);
    }

    return (
        <div className={`friendCard ${modalOpen ? "hover" : ""}`}>
            <div className="friendCardMain">
                <div className="friendCardImageContainer">
                    <img src={friend.targetUser.avatarURL} alt="Avatar" />
                </div>
                <div className="friendCardInfo">
                    <div className="friendName">{friend.targetUser.name}</div>
                    <dir>{online}</dir>
                </div>
            </div>
            {friend.status == 3 && (
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
                        className={`friendCardModal ${
                            modalOpen ? "display" : ""
                        }`}
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
            )}
            {friend.status == 2 && (
                <div className="friendCardActions">
                    <Button
                        styleRef="friendCardBtn"
                        onClick={acceptFriendRequest}
                        text="Accept"
                        loading={showLoader}
                        disabled={showLoader}
                    />
                    <Button
                        styleRef="friendCardBtn"
                        onClick={deleteFriend}
                        text="Decline"
                        loading={showLoader}
                        disabled={showLoader}
                    />
                </div>
            )}

            {friend.status == 1 && (
                <div className="friendCardActions">
                    <Button
                        styleRef="friendCardBtn"
                        onClick={deleteFriend}
                        text="Withdraw Request"
                        loading={showLoader}
                        disabled={showLoader}
                    />
                </div>
            )}

            <div
                className={`overlay ${modalOpen ? "display" : ""}`}
                onClick={toggleModal}
            ></div>
        </div>
    );
}

export default FriendCard;
