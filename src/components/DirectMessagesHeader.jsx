import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import uniqid from "uniqid";

import Button from "./Button";
import "./styles/DirectMessagesHeader.css";

function DirectMessagesHeader({ numChannels, setNumChannels, closeSidebar }) {
    const [channelTitle, setChannelTitle] = useState("");
    const [addUser, setAddUser] = useState("");
    const [userList, setUserList] = useState([]);

    const [newChannelOpen, setNewChannelOpen] = useState(false);

    const [showLoader, setShowLoader] = useState(false);

    const [formError, setFormError] = useState("");
    const [loggedIn, setLoggedIn, setError] = useOutletContext();
    const navigate = useNavigate();

    async function createNewChannel() {
        setShowLoader(true);
        setFormError("");
        setError("");

        let apiUsers = [];
        userList.forEach((user) => {
            apiUsers.push(user.name);
        });

        const formData = JSON.stringify({
            title: channelTitle,
            users: apiUsers,
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
            if (response.status == 400) {
                setFormError(result.errors);
            } else if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            } else {
                closeNewChannel();
                if (result.newChannel) {
                    let val = numChannels + 1;
                    setNumChannels(val);
                }
                closeSidebar();
                navigate(`/message-client/channels/${result.channelId}`);
            }
        } catch (err) {
            setError(err.message);
            setShowLoader(false);
            closeNewChannel();
        }
    }

    // Adds users on enter key
    function handleUserAdd(e) {
        if (e.key == "Enter") {
            // Can only add unique names
            if (userList.find((user) => user.name == e.target.value)) {
                setAddUser("");
            } else {
                setUserList([
                    ...userList,
                    { id: uniqid(), name: e.target.value },
                ]);
                setAddUser("");
            }
        }
    }

    // Deletes the specified user from the list
    function deleteListUser(id) {
        const tempUserList = userList.filter((user) => user.id != id);
        setUserList(tempUserList);
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
                            You can add {5 - userList.length} more friends.
                        </div>
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
                            disabled={userList.length >= 5}
                        />
                    </div>
                    {formError && (
                        <div className="newChannelErrorContainer">
                            <ul className="newChannelErrorList">
                                {formError.map((error, index) => (
                                    <li key={index} className="newChannelError">
                                        {error.msg}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </form>
                {userList.length > 0 && (
                    <div className="userList">
                        {userList.map((user) => (
                            <div key={user.id} className="userListEntry">
                                <div>{user.name}</div>
                                <button onClick={() => deleteListUser(user.id)}>
                                    &#x2715;
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="newChannelModalDivider"></div>
                <Button
                    styleRef="newChannelBtn"
                    onClick={createNewChannel}
                    text="Create DM"
                    loading={showLoader}
                    disabled={showLoader}
                />
            </div>
            <div
                className={`overlay ${newChannelOpen ? "display" : ""}`}
                onClick={closeNewChannel}
            ></div>
        </div>
    );
}

export default DirectMessagesHeader;
