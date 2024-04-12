import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { socket } from "../utils/socket";

import Button from "./Button";
import "./styles/DirectMessagesHeader.css";

function DirectMessagesHeader({
    numChannels,
    setNumChannels,
    friends,
    closeSidebar,
}) {
    const [channelTitle, setChannelTitle] = useState("");
    const [addUser, setAddUser] = useState("");
    const [userDisplayList, setUserDisplayList] = useState([]);

    const [newChannelOpen, setNewChannelOpen] = useState(false);

    const [showLoader, setShowLoader] = useState(false);

    const [formError, setFormError] = useState("");
    const [loggedIn, setLoggedIn, setError] = useOutletContext();
    const navigate = useNavigate();

    // Sends request to create new channel
    async function createNewChannel() {
        setShowLoader(true);
        setFormError("");
        setError("");

        // Get ids from userDisplayList for request
        let apiUsers = [];
        userDisplayList.forEach((user) => {
            apiUsers.push(user.id);
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
            //console.log(result);

            setShowLoader(false);

            // handle fetch response
            if (response.status == "401") {
                // Invalid Token
                navigate("/message-client/login", {
                    state: { message: "Your Session Timed Out." },
                });
            } else if (response.status == 400) {
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

                    // Emit that channel has been created
                    socket.emit("createChannel", {
                        users: result.channelUsers,
                    });
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
            let friend = friends.find(
                (friend) => friend.targetUser.name == e.target.value
            );

            // Can only add unique names
            if (userDisplayList.find((user) => user.name == e.target.value)) {
                setAddUser("");
            } else if (!friend || friend.status != 3) {
                setFormError([
                    { msg: "Can only send direct messages to friends" },
                ]);
            } else {
                setUserDisplayList([
                    ...userDisplayList,
                    { id: friend.targetUser._id, name: e.target.value },
                ]);
                setAddUser("");
            }
        }
    }

    // Deletes the specified user from the list
    function deleteListUser(id) {
        const tempUserList = userDisplayList.filter((user) => user.id != id);
        setUserDisplayList(tempUserList);
    }

    function openNewChannel() {
        setNewChannelOpen(true);
    }

    function closeNewChannel() {
        setUserDisplayList([]);
        setFormError("");
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
                            onChange={(e) => {
                                setFormError("");
                                setChannelTitle(e.target.value);
                            }}
                        />
                    </div>
                    <div className="newChannelFormElement">
                        <label htmlFor="newChannelUsers">Select Friends</label>
                        <div className="userListInfo">
                            You can add {5 - userDisplayList.length} more
                            friends.
                        </div>
                        <input
                            type="text"
                            name="newChannelUsers"
                            id="newChannelUsers"
                            className="newChannelUsers"
                            placeholder="Type user name and press enter."
                            autoComplete="off"
                            value={addUser}
                            onChange={(e) => {
                                setFormError("");
                                setAddUser(e.target.value);
                            }}
                            onKeyDown={handleUserAdd}
                            disabled={userDisplayList.length >= 5}
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
                {userDisplayList.length > 0 && (
                    <div className="userList">
                        {userDisplayList.map((user) => (
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
