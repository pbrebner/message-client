import { useState } from "react";

import Button from "./Button";
import "./styles/DirectMessagesHeader.css";

function DirectMessagesHeader({ numChannels, setNumChannels }) {
    const [channelTitle, setChannelTitle] = useState("");
    const [addUser, setAddUser] = useState("");
    const [userList, setUserList] = useState([]);

    const [newChannelOpen, setNewChannelOpen] = useState(false);

    const [showLoader, setShowLoader] = useState(false);

    const [formError, setFormError] = useState("");
    const [error, setError] = useState("");

    async function createNewChannel() {
        setFormError("");
        setError("");

        const formData = JSON.stringify({
            title: channelTitle,
            users: userList,
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
                setUserList([]);
                let val = numChannels + 1;
                setNumChannels(val);
            }
        } catch (err) {
            setError(err.message);
        }
    }

    //TODO: Create a key for each user
    function handleUserAdd(e) {
        if (e.key == "Enter") {
            setUserList([...userList, e.target.value]);
            setAddUser("");
        }
    }

    //TODO: Create function to remove a user fro the list
    function deleteListUser(e) {
        e.preventDefault();
    }

    function openNewChannel() {
        setNewChannelOpen(true);
    }

    function closeNewChannel() {
        setUserList([]);
        setNewChannelOpen(false);
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
                <form className="newChannelForm">
                    <div className="newChannelFormElement">
                        <label htmlFor="newChannelTitle">
                            Title (Optional)
                        </label>
                        <input
                            type="text"
                            name="newChannelTitle"
                            id="newChannelTitle"
                            className="newChannelTitle"
                            placeholder="Direct Message Title (Optional)."
                            autoComplete="off"
                            value={channelTitle}
                            onChange={(e) => setChannelTitle(e.target.value)}
                        />
                    </div>
                    <div className="newChannelFormElement">
                        <label htmlFor="newChannelUsers">Select Friends</label>
                        <div className="userListInfo">
                            You can add {9 - userList.length} more friends.
                        </div>
                        {userList.length > 0 && (
                            <div className="userList">
                                {userList.map((user) => (
                                    <div className="userListEntry">
                                        <div>{user}</div>
                                        <button onClick={deleteListUser}>
                                            &#x2715;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <input
                            type="text"
                            name="newChannelUsers"
                            id="newChannelUsers"
                            className="newChannelUsers"
                            placeholder="Type the name of a friend and press enter."
                            autoComplete="off"
                            value={addUser}
                            onChange={(e) => setAddUser(e.target.value)}
                            onKeyDown={handleUserAdd}
                        />
                    </div>
                </form>
                <div className="newChannelModalDivider"></div>
                <button className="newChannelBtn" onClick={closeNewChannel}>
                    Create DM
                </button>
            </div>
            <div
                className={`overlay ${newChannelOpen ? "display" : ""}`}
                onClick={closeNewChannel}
            ></div>
        </div>
    );
}

export default DirectMessagesHeader;
