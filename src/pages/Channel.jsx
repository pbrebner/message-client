import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import ChannelHeader from "../components/ChannelHeader";
import Messages from "../components/Messages";
import UserSidebar from "../components/UserSidebar";

import "./styles/Channels.css";

function Channel() {
    const [error, setError] = useState("");

    const navigate = useNavigate();

    //TODO: Confirm that the user is logged In, otherwise redirect to login

    return (
        <div className="channelSection">
            <ChannelHeader />
            <div className="hl"></div>
            <div className="channelMain">
                <Messages />
                <div className="vl"></div>
                <UserSidebar />
            </div>
        </div>
    );
}

export default Channel;
