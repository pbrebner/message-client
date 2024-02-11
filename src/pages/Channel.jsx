import { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";

import ChannelHeader from "../components/ChannelHeader";
import Messages from "../components/Messages";
import UserSidebar from "../components/UserSidebar";

import "./styles/Channels.css";

function Channel() {
    const [channel, setChannel] = useState("");
    const [error, setError] = useState("");

    const { channelId } = useParams();

    //Get channel
    useEffect(() => {
        async function getChannel() {
            try {
                const response = await fetch(
                    `https://message-api.fly.dev/api/channels/${channelId}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                }

                const data = await response.json();
                console.log(data);

                setChannel(data);
                setError("");
            } catch (err) {
                setError(err.message);
                setUser("");
            }
        }
        getChannel();
    }, [channelId]);

    return (
        <div className="channelSection">
            <ChannelHeader users={channel.users} />
            <div className="hl"></div>
            <div className="channelMain">
                <Messages />
                <div className="vl"></div>
                <UserSidebar users={channel.users} />
            </div>
        </div>
    );
}

export default Channel;
