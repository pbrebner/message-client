import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import FriendsHeader from "./FriendsHeader";
import FriendCard from "./FriendCard";
import AddFriend from "./AddFriend";
import "./styles/FriendsSection.css";

function FriendsSection() {
    const [showAll, setShowAll] = useState(true);
    const [showPending, setShowPending] = useState(false);
    const [showAdd, setShowAdd] = useState(false);

    const user = useOutletContext();
    console.log(user.friends);

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
                    {user.friends && user.friends.length > 0 ? (
                        <div className="friendCardContainer">
                            {user.friends.map((friend) => (
                                <FriendCard
                                    key={friend._id}
                                    friend={friend}
                                    friends={user.friends}
                                />
                            ))}
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
