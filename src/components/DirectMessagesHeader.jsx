import { useState } from "react";

import Button from "./Button";
import "./styles/DirectMessagesHeader.css";

function DirectMessagesHeader({
    newChannelOpen,
    openNewChannel,
    closeNewChannel,
    numChannels,
    setNumChannels,
}) {
    const [channelTitle, setChannelTitle] = useState("");
    const [users, setUsers] = useState([]);

    const [formError, setFormError] = useState("");
    const [error, setError] = useState("");

    // TODO: Display Users in a div as they are added

    async function createNewChannel(e) {
        e.preventDefault();

        setFormError("");
        setError("");

        const formData = JSON.stringify({
            title: "",
            users: users,
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

            console.log(response);
            const result = await response.json();
            console.log(result);

            // Handle any errors
            if (response.status == 400) {
                setFormError(result.errors);
            } else if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            } else {
                setUsers([]);
                let val = numChannels + 1;
                setNumChannels(val);
            }
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="directMessagesHeader">
            <p>Direct Messages</p>
            <button
                className="directMessagesHeaderBtn"
                onClick={openNewChannel}
            >
                &#x2B;
            </button>
            <div
                className={`newChannelModal ${newChannelOpen ? "display" : ""}`}
            >
                <div className="newChannelHeader">Select Friends</div>
                <form className="newChannelForm">
                    <input
                        type="text"
                        name="newChannelUsers"
                        id="newChannelUsers"
                        className="newChannelUsers"
                        placeholder="Type the name of a friend"
                    />
                </form>
                <div className="newChannelModalDivider"></div>
                <button className="newChannelBtn" onClick={closeNewChannel}>
                    Create DM
                </button>
            </div>
        </div>
    );
}

export default DirectMessagesHeader;
