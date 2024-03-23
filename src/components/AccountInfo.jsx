import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import Button from "../components/Button";
import "./styles/AccountInfo.css";

function AccountInfo({ user, numUserUpdates, setNumUserUpdates, guestUser }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [avatar, setAvatar] = useState("");

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    const [loggedIn, setLoggedIn, setError] = useOutletContext();
    const [formError, setFormError] = useState("");

    function getFormData() {
        let formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("bio", bio);

        if (avatar) {
            formData.append("avatar", avatar);
        }

        return formData;
    }

    async function updateUser() {
        setShowLoader(true);
        setError("");
        setFormError("");

        const formData = getFormData();

        // Make request to update User
        try {
            const response = await fetch(
                `https://message-api.fly.dev/api/users/${user._id}`,
                {
                    method: "put",
                    body: formData,
                    headers: {
                        authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            const result = await response.json();
            //console.log(result);

            setShowLoader(false);

            if (response.status == 400) {
                setFormError(result.errors);
            } else if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            } else {
                const val = numUserUpdates + 1;
                setNumUserUpdates(val);
                setEditModalOpen(false);
            }
        } catch (err) {
            setError(err.message);

            setShowLoader(false);
            setEditModalOpen(false);
        }
    }

    function openEditProfile() {
        setName(user.name);
        setEmail(user.email);
        setBio(user.bio);
        setEditModalOpen(true);
    }

    function cancelProfileEdit() {
        setFormError("");
        setAvatar("");
        setEditModalOpen(false);
    }

    return (
        <div className="accountInfo">
            <div className="accountInfoHeader">
                <div className="accountInfoHeaderMain">
                    <div className="accountImg">
                        <img src={user.avatarURL} />
                    </div>
                    <div className="accountName">{user.name}</div>
                </div>
                <button className="accountBtn" onClick={openEditProfile}>
                    Edit <span>Profile</span>
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

                <form className="editProfileForm" encType="multipart/form-data">
                    <div className="accountDivider"></div>
                    <div className="editProfileFormElement">
                        <label htmlFor="avatar">Avatar</label>
                        <input
                            type="file"
                            name="avatar"
                            id="avatar"
                            file={avatar}
                            onChange={(e) => setAvatar(e.target.files[0])}
                            accept="image/*"
                        />
                    </div>
                    <div className="accountDivider"></div>
                    <div className="editProfileFormElement">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            autoComplete="off"
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
                            autoComplete="off"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={guestUser}
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
                    <button
                        className="accountBtn"
                        onClick={cancelProfileEdit}
                        disabled={showLoader}
                    >
                        Cancel
                    </button>
                    <Button
                        styleRef="accountBtn"
                        onClick={updateUser}
                        text="Update"
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
