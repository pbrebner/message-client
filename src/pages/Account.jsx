import { useState, useEffect } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

import AccountInfo from "../components/AccountInfo";
import Button from "../components/Button";
import "./styles/Account.css";

function Account() {
    const [user, setUser] = useState("");

    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    const [error, setError] = useState("");

    const [loggedIn, setLoggedIn] = useOutletContext();
    const navigate = useNavigate();

    //TODO: Check if user is logged in a redirect if neccessary

    // Fetch the User
    useEffect(() => {
        async function getUser() {
            try {
                const response = await fetch(
                    `https://message-api.fly.dev/api/users/${localStorage.getItem(
                        "userId"
                    )}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );

                if (response.status == "403") {
                    // Invalid Token
                    navigate("/message-client/login");
                } else if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                }

                const data = await response.json();
                console.log(data);

                setUser(data.user);
                setName(data.user.name);
                setBio(data.user.bio);
                setEmail(data.user.email);
                setAvatar(data.user.avatar);
                setError("");
            } catch (err) {
                setError(err.message);
                setUser("");
            }
        }
        getUser();
    }, [user]);

    function handleLogOut() {
        setLoggedIn(false);
        localStorage.clear();
        navigate("/message-client/login");
    }

    async function deleteUser() {
        setShowLoader(true);
        setError("");

        // Make request to delete User
        try {
            const response = await fetch(
                `https://message-api.fly.dev/api/users/${user._id}`,
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
            setDeleteModalOpen(false);

            if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            } else {
                handleLogOut();
            }
        } catch (err) {
            setError(err.message);
        }
    }

    function closeModals() {
        setDeleteModalOpen(false);
    }

    return (
        <div className="account">
            <div className="accountMain">
                <div className="accountHeader">
                    <h2>My Account</h2>
                    <Link to="/message-client/channels" className="accountLink">
                        Back to Channels
                    </Link>
                </div>
                <AccountInfo
                    user={user}
                    name={name}
                    bio={bio}
                    email={email}
                    avatar={avatar}
                />
                <div className="accountDivider"></div>
                <div className="accountActions">
                    <h2>Log Out</h2>
                    <button
                        className="accountBtn logOutBtn"
                        onClick={handleLogOut}
                    >
                        Log Out
                    </button>
                </div>
                <div className="accountDivider"></div>
                <div className="accountActions">
                    <h2>Account Removal</h2>
                    <p>
                        Deleting the account is permanent and can't be undone.
                    </p>
                    <button
                        className="deleteAccountBtn"
                        onClick={() => setDeleteModalOpen(true)}
                    >
                        Delete Account
                    </button>
                </div>
            </div>
            <div className={`accountModal ${deleteModalOpen ? "display" : ""}`}>
                <h2>Confirm Delete?</h2>
                <p>Deleting the account is permanent and can't be undone.</p>
                <div className="accountDivider"></div>
                <div className="accountModalBtns">
                    <button className="accountBtn" onClick={closeModals}>
                        Cancel
                    </button>
                    <Button
                        styleRef="deleteAccountBtn"
                        onClick={deleteUser}
                        text="Confirm Delete"
                        loading={showLoader}
                        disabled={showLoader}
                    />
                </div>
            </div>
            <div
                className={`overlay ${deleteModalOpen ? "display" : ""}`}
                onClick={closeModals}
            ></div>
        </div>
    );
}

export default Account;
