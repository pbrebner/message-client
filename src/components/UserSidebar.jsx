import { formatDate } from "../utils/dates";
import "./styles/UserSidebar.css";

function UserSidebar({ otherUsers }) {
    return (
        <div className="userSidebar">
            {otherUsers &&
                otherUsers.map((user) => (
                    <div className="userCard">
                        <div className="userCardMain">
                            <div className="userCardImg">
                                <img src={user.avatar} />
                            </div>
                            <div className="userCardName">{user.name}</div>
                        </div>
                        <div className="userCardDivider"></div>
                        <div className="userCardSupp">
                            <div>{user.bio}</div>
                            <div>
                                Member since: {formatDate(user.timeStamp)}
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
}

export default UserSidebar;
