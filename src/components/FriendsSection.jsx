import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import FriendsHeader from "./FriendsHeader";
import AllFriends from "./AllFriends";
import FriendCard from "./FriendCard";
import AddFriend from "./AddFriend";
import noContent from "../assets/icons/no-content.png";

import "./styles/FriendsSection.css";

function FriendsSection() {
    const [friends, setFriends] = useState([]);
    const [pendingFriends, setPendingFriends] = useState([]);

    const [showAll, setShowAll] = useState(true);
    const [showPending, setShowPending] = useState(false);
    const [showAdd, setShowAdd] = useState(false);

    const [pageLoading, setPageLoading] = useState(true);

    const navigate = useNavigate();
    const [
        user,
        numChannels,
        setNumChannels,
        numChannelUpdates,
        setNumChannelUpdates,
        numFriends,
        setNumFriends,
        setError,
    ] = useOutletContext();

    // Fetch user friends
    useEffect(() => {
        async function getFriends() {
            setPageLoading(true);
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

                const result = await response.json();
                //console.log(result);

                setTimeout(() => {
                    setPageLoading(false);
                }, "1500");

                // Handle response
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
                    // Filter the results into friends and pendingfriends based on friend status
                    setFriends(result.filter((friend) => friend.status == 3));
                    setPendingFriends(
                        result.filter(
                            (friend) => friend.status == 1 || friend.status == 2
                        )
                    );
                }
            } catch (err) {
                setError(err.message);

                setTimeout(() => {
                    setPageLoading(false);
                }, "1500");
            }
        }
        getFriends();
    }, [numFriends]);

    // Helper function to clear state
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
                <AllFriends friends={friends} pageLoading={pageLoading} />
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
                                                />
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="friendsContainer empty">
                            <img src={noContent} alt="No Content" />
                            <div>You don't have any pending friends.</div>
                        </div>
                    )}
                </div>
            )}
            {showAdd && <AddFriend />}
        </div>
    );
}

export default FriendsSection;
