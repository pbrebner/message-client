import { useState } from "react";
import { Link } from "react-router-dom";

import { formatDate } from "../utils/dates";
import cog from "../assets/icons/settings.png";
import edit from "../assets/icons/edit.png";
import "./styles/UserProfileTab.css";

function UserProfileTab({ user }) {
    const [userTabOpen, setUserTabOpen] = useState(false);

    let online = "";
    user.online ? (online = "online") : (online = "offline");

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
                    <div>{user.name}</div>
                    <div>{online}</div>
                </div>
            </div>
            <div className="userTabActions">
                <Link
                    to="/message-client/account"
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
