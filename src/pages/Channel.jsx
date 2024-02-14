import { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";

import ChannelHeader from "../components/ChannelHeader";
import Messages from "../components/Messages";
import UserSidebar from "../components/UserSidebar";

import "./styles/Channels.css";

function Channel() {
    const [channel, setChannel] = useState("");
    const [otherUsers, setOtherUsers] = useState([]);

    const [error, setError] = useState("");

    const { channelId } = useParams();
    const user = useOutletContext();

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
                getOtherUsers(data.users);
                setError("");
            } catch (err) {
                setError(err.message);
            }
        }
        getChannel();
    }, [channelId]);

    // Gets all other channel users
    function getOtherUsers(users) {
        let channelUsersTemp = [];
        users.forEach((channelUser) => {
            if (user._id != channelUser._id) {
                channelUsersTemp.push(channelUser);
            }
        });

        setOtherUsers(channelUsersTemp);
    }

    return (
        <div className="channelSection">
            <ChannelHeader otherUsers={otherUsers} />
            <div className="hl"></div>
            <div className="channelMain">
                <Messages />
                <div className="vl"></div>
                <UserSidebar otherUsers={otherUsers} />
            </div>
        </div>
    );
}

export default Channel;
