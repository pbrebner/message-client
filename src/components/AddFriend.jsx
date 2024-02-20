import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import Button from "./Button";
import "./styles/AddFriend.css";

function AddFriend() {
    const [newFriend, setNewFriend] = useState("");

    const [showLoader, setShowLoader] = useState(false);

    const [formError, setFormError] = useState("");
    const [error, setError] = useState("");

    const user = useOutletContext();

    // TODO: Need to have numFriends and setNumFriends as props
    async function sendFriendRequest(e) {
        e.preventDefault();

        setShowLoader(true);
        setError("");
        setFormError("");

        const formData = JSON.stringify({
            targetUser: newFriend,
        });

        // Make request to create new Friend Request
        try {
            const response = await fetch(
                `https://message-api.fly.dev/api/users/${user._id}/friends`,
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
                //let val = numFriends + 1;
                //setNumFriends(val);
            }
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="friendsContainer">
            <div className="friendsTitle">Add Friend</div>
            <div>You can add friends with their name.</div>
            <form className="addFriendForm">
                <input
                    type="text"
                    name="addFriend"
                    id="addFriend"
                    className="addFriend"
                    placeholder="You can add friends with their name."
                    value={newFriend}
                    onChange={(e) => setNewFriend(e.target.value)}
                />
                <Button
                    styleRef="friendRequestBtn"
                    onClick={sendFriendRequest}
                    text="Send Friend Request"
                    loading={showLoader}
                    disabled={showLoader}
                />
                {formError && (
                    <div className="friendRequestErrorContainer">
                        <ul className="friendRequestErrorList">
                            {formError.map((error, index) => (
                                <li key={index} className="friendRequestError">
                                    {error.msg}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </form>
            <div className="friendsDivider"></div>
        </div>
    );
}

export default AddFriend;
