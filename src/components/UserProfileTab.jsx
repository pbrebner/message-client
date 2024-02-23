import { useState } from "react";
import { Link } from "react-router-dom";

import cog from "../assets/icons/settings.png";
import "./styles/UserProfileTab.css";

function UserProfileTab({ user }) {
    let online = "";
    user.online ? (online = "online") : (online = "offline");

    return (
        <div className="userProfileTab">
            <div className="userTabMain">
                <div className="userTabImg">
                    <img src={user.avatar} />
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
        </div>
    );
}

export default UserProfileTab;
