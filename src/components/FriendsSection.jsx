import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import FriendsHeader from "./FriendsHeader";
import FriendCard from "./FriendCard";
import AddFriend from "./AddFriend";
import "./styles/FriendsSection.css";

function FriendsSection() {
    const [friends, setFriends] = useState("");

    const [showAll, setShowAll] = useState(true);
    const [showPending, setShowPending] = useState(false);
    const [showAdd, setShowAdd] = useState(false);

    const [error, setError] = useState("");

    const user = useOutletContext();

    // Fetch user friends
    useEffect(() => {
        async function getFriends() {
            setError("");

            try {
                const response = await fetch(
                    `https://message-api.fly.dev/api/users/${user._id}/friends`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                }

                const data = await response.json();
                console.log(data);

                setFriends(data);
            } catch (err) {
                setError(err.message);
            }
        }
        getFriends();
    }, []);

    function showNone() {
        setShowAll(false);
        setShowPending(false);
        setShowAdd(false);
    }

    return (
        <div className="friendsSection">
            <FriendsHeader
                showNone={showNone}
                showAll={showAll}
                setShowAll={setShowAll}
                showPending={showPending}
                setShowPending={setShowPending}
                showAdd={showAdd}
                setShowAdd={setShowAdd}
            />
            <div className="hl"></div>
            {showAll && (
                <div className="friendsContainer">
                    <div className="friendsTitle">All Friends</div>
                    <div className="friendsDivider"></div>
                    {friends && friends.length > 0 ? (
                        <div className="friendCardContainer">
                            {friends.map((friend) => {
                                if (friend.status == 3) {
                                    return (
                                        <FriendCard
                                            key={friend._id}
                                            friend={friend}
                                        />
                                    );
                                }
                            })}
                        </div>
                    ) : (
                        <div>You don't have any friends</div>
                    )}
                </div>
            )}
            {showPending && (
                <div className="friendsContainer">
                    <div className="friendsTitle">
                        Pending Friends: Coming soon
                    </div>
                    <div className="friendsDivider"></div>
                </div>
            )}
            {showAdd && <AddFriend />}
        </div>
    );
}

export default FriendsSection;
