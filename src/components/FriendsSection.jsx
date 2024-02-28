import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import FriendsHeader from "./FriendsHeader";
import AllFriends from "./AllFriends";
import FriendCard from "./FriendCard";
import AddFriend from "./AddFriend";

import "./styles/FriendsSection.css";

function FriendsSection() {
    const [friends, setFriends] = useState("");
    const [numFriends, setNumFriends] = useState(0);

    const [pendingFriends, setPendingFriends] = useState("");

    const [showAll, setShowAll] = useState(true);
    const [showPending, setShowPending] = useState(false);
    const [showAdd, setShowAdd] = useState(false);

    const navigate = useNavigate();
    const [setError] = useOutletContext();

    // Fetch user friends
    useEffect(() => {
        async function getFriends() {
            setError("");

            try {
                const response = await fetch(
                    `https://message-api.fly.dev/api/users/${localStorage.getItem(
                        "userId"
                    )}/friends`,
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
                console.log(data);

                if (response.status == "401") {
                    // Invalid Token
                    navigate("/message-client/login");
                } else if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                } else {
                    setFriends(data.filter((friend) => friend.status == 3));
                    setNumFriends(data.length);
                    setPendingFriends(
                        data.filter(
                            (friend) => friend.status == 1 || friend.status == 2
                        )
                    );
                }
            } catch (err) {
                setError(err.message);
            }
        }
        getFriends();
    }, [numFriends]);

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
                <AllFriends
                    friends={friends}
                    numFriends={numFriends}
                    setNumFriends={setNumFriends}
                />
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
                                                    numFriends={numFriends}
                                                    setNumFriends={
                                                        setNumFriends
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
                                                    numFriends={numFriends}
                                                    setNumFriends={
                                                        setNumFriends
                                                    }
                                                />
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="friendsContainer">
                            You don't have any pending friends.
                        </div>
                    )}
                </div>
            )}
            {showAdd && (
                <AddFriend
                    numFriends={numFriends}
                    setNumFriends={setNumFriends}
                />
            )}
        </div>
    );
}

export default FriendsSection;
