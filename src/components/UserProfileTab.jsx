import { useState } from "react";
import { Link } from "react-router-dom";

import { formatDate } from "../utils/dates";
import cog from "../assets/icons/settings.png";
import edit from "../assets/icons/edit.png";
import "./styles/UserProfileTab.css";

function UserProfileTab({ user, closeSidebar }) {
    const [userTabOpen, setUserTabOpen] = useState(false);

    function closeUserTab() {
        setUserTabOpen(false);
    }

    return (
        <div className="userProfileTab">
            <div className="userTabMain" onClick={() => setUserTabOpen(true)}>
                <div className="userTabImg">
                    <img src={user.avatarURL} />
                </div>
                <div className="userTabDetails">
                    <div className="userName">{user.name}</div>
                    {user.online ? (
                        <div className="userOnline">
                            <div className="statusOnline"></div>
                            <div>online</div>
                        </div>
                    ) : (
                        <div className="userOnline">
                            <div className="statusOffline"></div>
                            <div>offline</div>
                        </div>
                    )}
                </div>
            </div>
            <div className="userTabActions">
                <Link
                    to="/message-client/account"
                    onClick={closeSidebar}
                    className="userTabAction"
                    title="User Account"
                >
                    <img src={cog} />
                </Link>
            </div>
            <div className={`userTabModal ${userTabOpen ? "display" : ""}`}>
                <div className="userTabModalHeader">
                    <div className="userTabModalImg">
                        <img src={user.avatarURL} />
                    </div>
                    <Link
                        to="/message-client/account"
                        onClick={closeSidebar}
                        className="userTabEdit"
                        title="Edit Account"
                    >
                        <img src={edit} />
                    </Link>
                </div>
                <div className="userTabModalMain">
                    <div className="userTabModalName">{user.name}</div>
                    <div className="userTabModalDivider"></div>
                    <div>
                        <p>Member Since</p>
                        <div>{formatDate(user.timeStamp)}</div>
                    </div>
                    <div className="userTabModalDivider"></div>
                    {user.bio && <div>{user.bio}</div>}
                </div>
            </div>
            <div
                className={`overlay ${userTabOpen ? "display" : ""}`}
                onClick={closeUserTab}
            ></div>
        </div>
    );
}

export default UserProfileTab;
