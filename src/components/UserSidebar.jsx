import { formatDate } from "../utils/dates";
import "./styles/UserSidebar.css";

function UserSidebar({ otherUsers, pageLoading }) {
    return (
        <div className="userSidebar">
            {pageLoading && (
                <div className="userLoader">
                    <div className="userLoaderCard"></div>
                    <div className="userLoaderCard"></div>
                </div>
            )}
            {otherUsers &&
                otherUsers.map((user) => (
                    <div key={user._id} className="userCard">
                        <div className="userCardMain">
                            <div className="userCardImg">
                                <img src={user.avatarURL} />
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
