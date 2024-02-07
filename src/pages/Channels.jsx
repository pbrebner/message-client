import { useState, useEffect } from "react";

// TODO: Create a channels header (either in this compnent or make new header component)
import ChannelSidebar from "../components/ChannelSidebar";
import Messages from "../components/Messages";
import UserSidebar from "../components/UserSidebar";

function Channels() {
    const [channel, setChannel] = useState("");

    //TODO: Confirm that the user is logged In, otherwise redirect to login

    // TODO: Fetch the users channels (Fetch the user?)

    return (
        <div className="channels">
            <h1>Channels Page</h1>
        </div>
    );
}

export default Channels;
