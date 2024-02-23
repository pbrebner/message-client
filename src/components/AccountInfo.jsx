import { useState } from "react";

import Button from "../components/Button";
import "./styles/AccountInfo.css";

function AccountInfo({ user, setUser }) {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [bio, setBio] = useState(user.bio);
    const [avatar, setAvatar] = useState(user.avatar);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");

    async function updateUser() {
        setShowLoader(true);
        setError("");
        setFormError("");

        formData = JSON.stringify({
            name: name,
            email: email,
            bio: bio,
        });

        // Make request to update User
        try {
            const response = await fetch(
                `https://message-api.fly.dev/api/users/${user._id}`,
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
            setEditModalOpen(false);

            if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            } else {
                setUser({
                    ...user,
                    name: name,
                    email: email,
                    bio: bio,
                    avatar: avatar,
                });
            }
        } catch (err) {
            setError(err.message);
        }
    }

    function cancelProfileEdit() {
        setFormError("");
        setEditModalOpen(false);
        setName(user.name);
        setEmail(user.email);
        setBio(user.bio);
        setAvatar(user.avatar);
    }

    return (
        <div className="accountInfo">
            <div className="accountInfoHeader">
                <div>
                    <div className="accountImg">
                        <img src={user.avatar} />
                    </div>
                    <div className="accountName">{user.name}</div>
                </div>
                <button
                    className="accountBtn"
                    onClick={() => setEditModalOpen(true)}
                >
                    Edit User Profile
                </button>
            </div>
            <div className="accountDivider"></div>
            <div className="accountInfoMain">
                <div className="accountInfoSection">
                    <div>
                        <p>Name</p>
                        <div>{user.name}</div>
                    </div>
                </div>
                <div className="accountInfoSection">
                    <div>
                        <p>Bio</p>
                        <div>{user.bio}</div>
                    </div>
                </div>
                <div className="accountInfoSection">
                    <div>
                        <p>Email</p>
                        <div>{user.email}</div>
                    </div>
                </div>
            </div>
            <div className={`accountModal ${editModalOpen ? "display" : ""}`}>
                <h2>Profile Information</h2>
                <div className="accountDivider"></div>
                <form className="editProfileForm">
                    <div className="editProfileFormElement">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="editProfileFormElement">
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="editProfileFormElement">
                        <label htmlFor="bio">Bio</label>
                        <textarea
                            name="bio"
                            id="bio"
                            cols="30"
                            rows="10"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        ></textarea>
                    </div>
                    {formError && (
                        <div className="editProfileErrorContainer">
                            <ul className="editProfileErrorList">
                                {formError.map((error, index) => (
                                    <li
                                        key={index}
                                        className="editProfileError"
                                    >
                                        {error.msg}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </form>
                <div className="accountDivider"></div>
                <div className="accountModalBtns">
                    <button className="accountBtn" onClick={cancelProfileEdit}>
                        Cancel
                    </button>
                    <Button
                        styleRef="accountBtn"
                        onClick={updateUser}
                        text="Update Profile"
                        loading={showLoader}
                        disabled={showLoader}
                    />
                </div>
            </div>
            <div
                className={`overlay ${editModalOpen ? "display" : ""}`}
                onClick={cancelProfileEdit}
            ></div>
        </div>
    );
}

export default AccountInfo;
