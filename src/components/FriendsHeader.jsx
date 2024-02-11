import "./styles/FriendsHeader.css";

function FriendsHeader() {
    return (
        <div className="friendsHeader">
            <div className="friendsHeaderTitle">Friends</div>
            <div className="friendsHeaderDivider"></div>
            <div className="friendsHeaderBtns">
                <button className="friendsHeaderBtn">All</button>
                <button className="friendsHeaderBtn">Online</button>
                <button className="friendsHeaderBtn">Pending</button>
                <button className="friendsHeaderBtn">Add Friend</button>
            </div>
        </div>
    );
}

export default FriendsHeader;
