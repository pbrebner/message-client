import { useState } from "react";

import Button from "./Button";
import "./styles/AddFriend.css";

function AddFriend() {
    const [newFriend, setNewFriend] = useState("");

    const [showLoader, setShowLoader] = useState(false);

    const [formError, setFormError] = useState("");
    const [error, setError] = useState("");

    // TODO: Make request to add new friend (API need to be updated)
    async function sendFriendRequest(e) {
        e.preventDefault();
        console.log("Sending friend request");
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
