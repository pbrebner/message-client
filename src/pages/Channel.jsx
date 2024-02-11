import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

// TODO: Create a channels header (either in this compnent or make new header component)
import Messages from "../components/Messages";
import UserSidebar from "../components/UserSidebar";

import "./styles/Channels.css";

function Channel() {
    const [error, setError] = useState("");

    const navigate = useNavigate();

    //TODO: Confirm that the user is logged In, otherwise redirect to login

    return (
        <div className="channelSection">
            <Messages />
            <div className="vl"></div>
            <UserSidebar />
        </div>
    );
}

export default Channel;
