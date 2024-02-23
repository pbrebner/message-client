import { useState } from "react";

import Button from "../components/Button";
import "./styles/AccountInfo.css";

function AccountInfo({ user, name, bio, email, avatar }) {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");

    async function updateUser() {
        setShowLoader(true);
        setError("");
        setFormError("");

        // Make request to update User
        try {
            const response = await fetch(
                `https://message-api.fly.dev/api/users/${user._id}`,
                {
                    method: "put",
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
                console.log("done");
            }
        } catch (err) {
            setError(err.message);
        }
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
                <button className="accountBtn">Edit User Profile</button>
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
        </div>
    );
}

export default AccountInfo;
