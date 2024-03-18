import { useState, useEffect } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

import AccountInfo from "../components/AccountInfo";
import PageLoader from "../components/PageLoader";
import Button from "../components/Button";
import "./styles/Account.css";

function Account() {
    const [user, setUser] = useState("");

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [numUserUpdates, setNumUserUpdates] = useState(0);

    const [pageLoading, setPageLoading] = useState(true);

    const [loggedIn, setLoggedIn, setError] = useOutletContext();
    const navigate = useNavigate();

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

                const data = await response.json();
                //console.log(data);

                setTimeout(() => {
                    setPageLoading(false);
                }, "2000");

                if (response.status == "401") {
                    // Invalid Token
                    navigate("/message-client/login");
                } else if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                } else {
                    setUser(data.user);
                    setError("");
                }
            } catch (err) {
                setError(err.message);
                setUser("");

                setTimeout(() => {
                    setPageLoading(false);
                }, "2000");
            }
        }
        getUser();
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
                    <AccountInfo
                        user={user}
                        numUserUpdates={numUserUpdates}
                        setNumUserUpdates={setNumUserUpdates}
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
                            disabled={showLoader}
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
