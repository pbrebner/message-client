import FriendsHeader from "./FriendsHeader";
import "./styles/Friends.css";

function Friends() {
    return (
        <div className="friendsSection">
            <FriendsHeader />
            <div className="hl"></div>
            <div className="friends">Friends Container</div>
        </div>
    );
}

export default Friends;
