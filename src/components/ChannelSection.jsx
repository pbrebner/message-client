import { useState, useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

import ChannelHeader from "./ChannelHeader";
import Messages from "./Messages";
import UserSidebar from "./UserSidebar";

//import "../pages/styles/Channels.css";

function ChannelSection() {
    const [channel, setChannel] = useState("");
    const [otherUsers, setOtherUsers] = useState([]);

    const [error, setError] = useState("");

    const { channelId } = useParams();
    const updateChannel = useOutletContext();
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();

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

                if (response.status == "401") {
                    // Invalid Token
                    navigate("/message-client/login");
                } else if (!response.ok) {
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
    }, [channelId, updateChannel]);

    // Gets all other channel users
    function getOtherUsers(users) {
        let channelUsersTemp = [];
        users.forEach((channelUser) => {
            if (userId != channelUser._id) {
                channelUsersTemp.push(channelUser);
            }
        });

        setOtherUsers(channelUsersTemp);
    }

    return (
        <div className="channelSection">
            <ChannelHeader otherUsers={otherUsers} channel={channel} />
            <div className="hl"></div>
            <div className="channelMain">
                <Messages />
                <div className="vl"></div>
                <UserSidebar otherUsers={otherUsers} />
            </div>
        </div>
    );
}

export default ChannelSection;
