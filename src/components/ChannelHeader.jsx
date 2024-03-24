import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import Button from "./Button";
import "./styles/ChannelHeader.css";

function ChannelHeader({ otherUsers, channel, friends, pageLoading }) {
    const [addUser, setAddUser] = useState("");
    const [addUserOpen, setAddUserOpen] = useState(false);

    const [addTitle, setAddTitle] = useState("");
    const [addTitleOpen, setAddTitleOpen] = useState(false);

    const [showLoader, setShowLoader] = useState(false);

    const [formError, setFormError] = useState("");
    const [
        user,
        numChannels,
        setNumChannels,
        numChannelUpdates,
        setNumChannelUpdates,
        numFriends,
        setNumFriends,
        setError,
    ] = useOutletContext();

    function handleUsersUpdate() {
        let friend = friends.find(
            (friend) => friend.targetUser.name == addUser
        );

        if (!friend || friend.status != 3) {
            setFormError([{ msg: "Can only send direct messages to friends" }]);
        } else {
            let formData = JSON.stringify({ users: [friend.targetUser._id] });
            updateChannel(formData);
        }
    }

    function handleTitleUpdate() {
        let formData = JSON.stringify({ title: addTitle });
        updateChannel(formData);
    }

    async function updateChannel(formData) {
        setShowLoader(true);
        setFormError("");
        setError("");

        // Make request to update Channel
        try {
            const response = await fetch(
                `https://message-api.fly.dev/api/channels/${channel._id}`,
                {
                    method: "put",
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

            // Handle any errors
            if (response.status == 400) {
                setFormError(result.errors);
            } else if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            } else {
                closeModals();

                const val = numChannelUpdates + 1;
                setNumChannelUpdates(val);
            }
        } catch (err) {
            setError(err.message);
            setShowLoader(false);
            closeModals();
        }
    }

    function toggleAddTitleOpen() {
        addTitleOpen === true ? setAddTitleOpen(false) : setAddTitleOpen(true);
    }

    function toggleAddUserOpen() {
        addUserOpen === true ? setAddUserOpen(false) : setAddUserOpen(true);
    }

    function closeModals() {
        setAddTitle("");
        setAddUser("");
        setAddTitleOpen(false);
        setAddUserOpen(false);
        setFormError("");
    }

    return (
        <div className="channelHeader">
            <div className="channelHeaderInfoContainer">
                <div className="menuSpacer"></div>
                <div className="menuSpacerDivider"></div>

                {pageLoading && (
                    <div className="channelHeaderLoader">
                        <div className="channelHeaderLoaderCard"></div>
                    </div>
                )}
                {channel.title ? (
                    <div className="channelHeaderInfo">
                        <div className="channelHeaderTitle">
                            {channel.title}
                        </div>
                    </div>
                ) : (
                    <div className="channelHeaderInfo">
                        {otherUsers.length == 1 &&
                            otherUsers.map((user) => (
                                <div
                                    key={user._id}
                                    className="channelHeaderUser"
                                >
                                    <div className="channelHeaderUserImg">
                                        <img src={user.avatarURL} />
                                    </div>
                                    <div className="channelHeaderUserName">
                                        {user.name}
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>

            <div className="channelHeaderActions">
                <div className="channelHeaderDivider"></div>
                {channel.title ? (
                    <button
                        className="channelHeaderBtn"
                        onClick={toggleAddTitleOpen}
                    >
                        Update Title
                    </button>
                ) : (
                    <button
                        className="channelHeaderBtn"
                        onClick={toggleAddTitleOpen}
                    >
                        Add Title
                    </button>
                )}
                <button
                    className="channelHeaderBtn"
                    onClick={toggleAddUserOpen}
                >
                    Add User to DM
                </button>
            </div>
            <div
                className={`channelHeaderModal ${
                    addTitleOpen ? "display" : ""
                }`}
            >
                <form className="channelHeaderForm">
                    <div className="channelHeaderFormElement">
                        <label htmlFor="addTitle">Update Channel Title</label>
                        <input
                            type="text"
                            name="addTitle"
                            id="addTitle"
                            className="addTitle"
                            placeholder="Enter a channel title."
                            autoComplete="off"
                            value={addTitle}
                            onChange={(e) => {
                                setFormError("");
                                setAddTitle(e.target.value);
                            }}
                        />
                    </div>
                    {formError && (
                        <div className="channelHeaderErrorContainer">
                            <ul className="channelHeaderErrorList">
                                {formError.map((error, index) => (
                                    <li
                                        key={index}
                                        className="channelHeaderError"
                                    >
                                        {error.msg}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </form>
                <div className="channelHeaderModalDivider"></div>
                <Button
                    styleRef="addTitleBtn"
                    onClick={handleTitleUpdate}
                    text="Update Title"
                    loading={showLoader}
                    disabled={showLoader}
                />
            </div>
            <div
                className={`channelHeaderModal ${addUserOpen ? "display" : ""}`}
            >
                <form className="channelHeaderForm">
                    <div className="channelHeaderFormElement">
                        <label htmlFor="addUser">Select Friend</label>
                        <input
                            type="text"
                            name="addUser"
                            id="addUser"
                            className="addUser"
                            placeholder="Add a user with their name."
                            autoComplete="off"
                            value={addUser}
                            onChange={(e) => {
                                setFormError("");
                                setAddUser(e.target.value);
                            }}
                        />
                    </div>
                    {formError && (
                        <div className="channelHeaderErrorContainer">
                            <ul className="channelHeaderErrorList">
                                {formError.map((error, index) => (
                                    <li
                                        key={index}
                                        className="channelHeaderError"
                                    >
                                        {error.msg}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </form>
                <div className="channelHeaderModalDivider"></div>
                <Button
                    styleRef="addUserBtn"
                    onClick={handleUsersUpdate}
                    text="Add User to DM"
                    loading={showLoader}
                    disabled={showLoader}
                />
            </div>
            <div
                className={`overlay ${
                    addUserOpen || addTitleOpen ? "display" : ""
                }`}
                onClick={closeModals}
            ></div>
        </div>
    );
}

export default ChannelHeader;
