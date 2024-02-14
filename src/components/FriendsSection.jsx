import { useState } from "react";

import FriendsHeader from "./FriendsHeader";
import AddFriend from "./AddFriend";
import "./styles/FriendsSection.css";

function FriendsSection() {
    const [showAll, setShowAll] = useState(true);
    const [showPending, setShowPending] = useState(false);
    const [showAdd, setShowAdd] = useState(false);

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
                    <div className="friendCard">Friend Cards</div>
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
