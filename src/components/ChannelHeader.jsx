import { useState } from "react";

import Button from "./Button";
import "./styles/ChannelHeader.css";

function ChannelHeader({ otherUsers, channel }) {
    const [addUser, setAddUser] = useState("");
    const [addUserOpen, setAddUserOpen] = useState(false);

    const [showLoader, setShowLoader] = useState(false);

    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");

    async function handleAddUser() {
        setShowLoader(true);
        setFormError("");
        setError("");

        const formData = JSON.stringify({
            users: [addUser],
        });

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
                setAddUserOpen(false);
            }
        } catch (err) {
            setError(err.message);
        }
    }

    function toggleAddUserOpen() {
        addUserOpen === true ? setAddUserOpen(false) : setAddUserOpen(true);
    }

    return (
        <div className="channelHeader">
            <div className="channelHeaderUsers">
                {otherUsers &&
                    otherUsers.map((user) => (
                        <div key={user._id} className="channelHeaderUser">
                            <div className="channelHeaderUserImg">
                                <img src={user.avatar} />
                            </div>
                            <div> {user.name}</div>
                        </div>
                    ))}
            </div>
            <div className="channelHeaderActions">
                <button
                    className="channelHeaderBtn"
                    onClick={toggleAddUserOpen}
                >
                    Add User to DM
                </button>
            </div>
            <div className={`addUserModal ${addUserOpen ? "display" : ""}`}>
                <form className="addUserForm">
                    <div className="addUserFormElement">
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
                        <div className="addUserErrorContainer">
                            <ul className="addUserErrorList">
                                {formError.map((error, index) => (
                                    <li key={index} className="addUserError">
                                        {error.msg}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </form>
                <div className="addUserModalDivider"></div>
                <Button
                    styleRef="addUserBtn"
                    onClick={handleAddUser}
                    text="Add User to DM"
                    loading={showLoader}
                    disabled={showLoader}
                />
            </div>
            <div
                className={`overlay ${addUserOpen ? "display" : ""}`}
                onClick={toggleAddUserOpen}
            ></div>
        </div>
    );
}

export default ChannelHeader;
