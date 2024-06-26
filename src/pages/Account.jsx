import { useState, useEffect } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { socket } from "../utils/socket";

import AccountInfo from "../components/AccountInfo";
import PageLoader from "../components/PageLoader";
import Button from "../components/Button";
import "./styles/Account.css";

function Account() {
    const [user, setUser] = useState("");
    const [guestUser, setGuestUser] = useState(false);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [numUserUpdates, setNumUserUpdates] = useState(0);

    const [pageLoading, setPageLoading] = useState(true);

    const [loggedIn, setLoggedIn, setError] = useOutletContext();
    const navigate = useNavigate();

    // Fetch the User. Runs on user updates
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

                const data = await response.json();
                //console.log(data);

                // Handle fetch response
                if (response.status == "401") {
                    // Invalid Token
                    navigate("/message-client/login", {
                        state: { message: "Your Session Timed Out." },
                    });
                } else if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                } else {
                    setUser(data.user);
                    setGuestUser(data.guestProfile);
                    setError("");
                }
            } catch (err) {
                setError(err.message);
                setUser("");
            }
        }
        getUser();

        // Set timeout for page loading
        setTimeout(() => {
            setPageLoading(false);
        }, "2000");
    }, [numUserUpdates]);

    /*
    async function handleLogOut() {
        setShowLoader(true);
        setError("");

        try {
            const response = await fetch(
                "https://message-api.fly.dev/api/logout",
                {
                    method: "post",
                    headers: { "content-Type": "application/json" },
                }
            );

            const result = await response.json();
            console.log(result);

            setShowLoader(false);

            if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            } else {
                setLoggedIn(false);
                localStorage.clear();
                navigate("/message-client/login");
            }
        } catch (err) {
            setError(err.message);
            console.log(err.message);
            setShowLoader(false);
        }
    }
    */

    // Handle logging out
    function handleLogOut() {
        setLoggedIn(false);
        localStorage.clear();
        navigate("/message-client/login");

        // Emits offline and triggers online status change on backend
        socket.emit("offline", { userId: user._id });
    }

    // Sends request to delete user
    async function deleteUser() {
        setShowLoader(true);
        setError("");

        // Make request to delete User
        try {
            const response = await fetch(
                `https://message-api.fly.dev/api/users/${localStorage.getItem(
                    "userId"
                )}`,
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
            //console.log(result);

            // Handle response
            if (response.status == "401") {
                // Invalid Token
                navigate("/message-client/login", {
                    state: { message: "Your Session Timed Out." },
                });
            } else if (!response.ok) {
                setShowLoader(false);
                setDeleteModalOpen(false);

                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            } else {
                // Emit to friends that acccount was deleted in order to trigger updates
                const friendIdArray = user.friends.map(
                    (friend) => friend.targetUser
                );
                socket.emit("updateFriend", { friends: friendIdArray });

                // Emit to all channels that account was deleted in order to trigger updates
                const channelIdArray = user.channels.map(
                    (channel) => channel._id
                );
                if (channelIdArray.length > 0) {
                    channelIdArray.forEach((channelId) => {
                        socket.emit("updatechannel", { room: channelId });
                        socket.emit("updateMessage", { room: channelId });
                    });
                }

                setShowLoader(false);
                setDeleteModalOpen(false);

                handleLogOut();
            }
        } catch (err) {
            setError(err.message);

            setShowLoader(false);
            setDeleteModalOpen(false);
        }
    }

    function closeModals() {
        setDeleteModalOpen(false);
    }

    return (
        <>
            {pageLoading && <PageLoader />}
            <div className="account">
                <div className="accountMain">
                    <div className="accountHeader">
                        <h2>My Account</h2>
                        <Link
                            to="/message-client/channels"
                            className="accountLink"
                        >
                            Back <span>to Channels</span>
                        </Link>
                    </div>
                    {guestUser && (
                        <div className="guestUserStatement">
                            Certain features are disabled on guest accounts.
                        </div>
                    )}
                    <AccountInfo
                        user={user}
                        numUserUpdates={numUserUpdates}
                        setNumUserUpdates={setNumUserUpdates}
                        guestUser={guestUser}
                    />
                    <div className="accountDivider"></div>
                    <div className="accountActions">
                        <h2>Log Out</h2>
                        <Button
                            styleRef="accountBtn logOutBtn"
                            onClick={handleLogOut}
                            text="Log Out"
                            loading={showLoader}
                            disabled={showLoader}
                        />
                    </div>
                    <div className="accountDivider"></div>
                    <div className="accountActions">
                        <h2>Account Removal</h2>
                        <p>
                            Deleting the account is permanent and can't be
                            undone.
                        </p>
                        <button
                            className="deleteAccountBtn"
                            onClick={() => setDeleteModalOpen(true)}
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
                <div
                    className={`accountModal ${
                        deleteModalOpen ? "display" : ""
                    }`}
                >
                    <h2>Confirm Delete?</h2>
                    <p>
                        Deleting the account is permanent and can't be undone.
                    </p>
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
                            disabled={showLoader || guestUser}
                        />
                    </div>
                </div>
                <div
                    className={`overlay ${deleteModalOpen ? "display" : ""}`}
                    onClick={closeModals}
                ></div>
            </div>
        </>
    );
}

export default Account;
