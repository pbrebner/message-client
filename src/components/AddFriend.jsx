import { useState } from "react";

function AddFriend() {
    const [newFriend, setNewFriend] = useState("");

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
                />
                <button
                    className="friendRequestBtn"
                    onClick={sendFriendRequest}
                >
                    Send Friend Request
                </button>
            </form>
            <div className="friendsDivider"></div>
        </div>
    );
}

export default AddFriend;
