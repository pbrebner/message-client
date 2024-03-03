import "./styles/FriendsHeader.css";

function FriendsHeader({
    showNone,
    showAll,
    setShowAll,
    showPending,
    setShowPending,
    showAdd,
    setShowAdd,
}) {
    return (
        <div className="friendsHeader">
            <div className="menuSpacer"></div>
            <div className="menuSpacerDivider"></div>
            <div className="friendsHeaderTitle">Friends</div>
            <div className="friendsHeaderDivider"></div>
            <div className="friendsHeaderBtns">
                <button
                    className={`friendsHeaderBtn ${showAll ? "selected" : ""}`}
                    onClick={() => {
                        showNone();
                        setShowAll(true);
                    }}
                >
                    All
                </button>
                <button
                    className={`friendsHeaderBtn ${
                        showPending ? "selected" : ""
                    }`}
                    onClick={() => {
                        showNone();
                        setShowPending(true);
                    }}
                >
                    Pending
                </button>
                <button
                    className={`friendsHeaderBtn addFriendBtn ${
                        showAdd ? "selected" : ""
                    }`}
                    onClick={() => {
                        showNone();
                        setShowAdd(true);
                    }}
                >
                    Add Friend
                </button>
            </div>
        </div>
    );
}

export default FriendsHeader;
