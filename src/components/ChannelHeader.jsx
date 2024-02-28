import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import Button from "./Button";
import "./styles/ChannelHeader.css";

function ChannelHeader({ otherUsers, channel }) {
    const [addUser, setAddUser] = useState("");
    const [addUserOpen, setAddUserOpen] = useState(false);

    const [addTitle, setAddTitle] = useState("");
    const [addTitleOpen, setAddTitleOpen] = useState(false);

    const [showLoader, setShowLoader] = useState(false);

    const [formError, setFormError] = useState("");
    const [updateChannel, setUpdateChannel, setError] = useOutletContext();

    async function handleUpdateChannel() {
        setShowLoader(true);
        setFormError("");
        setError("");

        const formData = getFormData();

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
                closeModals();

                const val = updateChannel + 1;
                setUpdateChannel(val);
            }
        } catch (err) {
            setError(err.message);
            setShowLoader(false);
            closeModals();
        }
    }

    function getFormData() {
        if (addTitle) {
            return JSON.stringify({
                title: addTitle,
            });
        } else {
            return JSON.stringify({
                users: [addUser],
            });
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
    }

    return (
        <div className="channelHeader">
            <div className="channelHeaderUsers">
                {otherUsers &&
                    otherUsers.map((user) => (
                        <div key={user._id} className="channelHeaderUser">
                            <div className="channelHeaderUserImg">
                                <img src={user.avatarURL} />
                            </div>
                            <div> {user.name}</div>
                        </div>
                    ))}
            </div>
            <div className="channelHeaderActions">
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
                            onChange={(e) => setAddTitle(e.target.value)}
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
                    onClick={handleUpdateChannel}
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
                            onChange={(e) => setAddUser(e.target.value)}
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
                    onClick={handleUpdateChannel}
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
