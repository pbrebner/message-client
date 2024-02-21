import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import FriendsHeader from "./FriendsHeader";
import FriendCard from "./FriendCard";
import AddFriend from "./AddFriend";
import "./styles/FriendsSection.css";

function FriendsSection() {
    const [friends, setFriends] = useState("");
    const [numAllFriends, setNumAllFriends] = useState(0);

    const [pendingFriends, setPendingFriends] = useState("");

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

                setFriends(data.filter((friend) => friend.status == 3));
                setNumAllFriends(data.length);
                setPendingFriends(
                    data.filter(
                        (friend) => friend.status == 1 || friend.status == 2
                    )
                );
            } catch (err) {
                setError(err.message);
            }
        }
        getFriends();
    }, [numAllFriends]);

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
                <div className="friendsOuterContainer">
                    {friends && friends.length > 0 ? (
                        <div className="friendsContainer">
                            <div className="friendsTitle">
                                All Friends - {friends.length}
                            </div>
                            <div className="friendsDivider"></div>
                            <div className="friendCardContainer">
                                {friends.map((friend) => (
                                    <FriendCard
                                        key={friend._id}
                                        friend={friend}
                                        numFriends={numAllFriends}
                                        setNumFriends={setNumAllFriends}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>You don't have any friends yet.</div>
                    )}
                </div>
            )}
            {showPending && (
                <div className="friendsOuterContainer">
                    {pendingFriends && pendingFriends.length > 0 ? (
                        <div className="friendsContainer">
                            <div className="friendsInnerContainer">
                                <div className="friendsTitle">
                                    Friend Requests
                                </div>
                                <div className="friendsDivider"></div>
                                <div className="friendCardContainer">
                                    {pendingFriends.map((friend) => {
                                        if (friend.status == 2) {
                                            return (
                                                <FriendCard
                                                    key={friend._id}
                                                    friend={friend}
                                                    numFriends={numAllFriends}
                                                    setNumFriends={
                                                        setNumAllFriends
                                                    }
                                                />
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                            <div className="friendsInnerContainer">
                                <div className="friendsTitle">
                                    Pending Friends
                                </div>
                                <div className="friendsDivider"></div>
                                <div className="friendCardContainer">
                                    {pendingFriends.map((friend) => {
                                        if (friend.status == 1) {
                                            return (
                                                <FriendCard
                                                    key={friend._id}
                                                    friend={friend}
                                                    numFriends={numAllFriends}
                                                    setNumFriends={
                                                        setNumAllFriends
                                                    }
                                                />
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>You don't have any pending friends.</div>
                    )}
                </div>
            )}
            {showAdd && (
                <AddFriend
                    numFriends={numAllFriends}
                    setNumFriends={setNumAllFriends}
                />
            )}
        </div>
    );
}

export default FriendsSection;
