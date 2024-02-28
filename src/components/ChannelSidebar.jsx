import { useState, useEffect } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

import ChannelSearch from "./ChannelSearch";
import DirectMessagesHeader from "./DirectMessagesHeader";
import ChannelCard from "./ChannelCard";
import UserProfileTab from "./UserProfileTab";
import "./styles/ChannelSidebar.css";

function ChannelSidebar({ user, numChannels, setNumChannels, updateChannel }) {
    const [channels, setChannels] = useState("");
    // const [numChannels, setNumChannels] = useState(0);

    const [setError] = useOutletContext();
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();

    //Get all users channels
    useEffect(() => {
        async function getChannels() {
            try {
                const response = await fetch(
                    "https://message-api.fly.dev/api/channels",
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

                setChannels(getFilteredChannels(data));
                // setNumChannels(data.length);
                setError("");
            } catch (err) {
                setError(err.message);
            }
        }
        getChannels();
    }, [numChannels, updateChannel]);

    // Removes the users own value from channel
    function getFilteredChannels(channels) {
        channels.map((channel) => {
            channel.users = channel.users.filter((user) => user._id != userId);
        });

        return channels;
    }

    return (
        <div className="channelSidebar">
            <div className="channelSidebarHeader">
                <ChannelSearch channels={channels} />
            </div>
            <div className="hl"></div>
            <div className="channelSidebarMain">
                <Link to="../channels" className="channelSidebarLink">
                    Friends
                </Link>
                <DirectMessagesHeader
                    numChannels={numChannels}
                    setNumChannels={setNumChannels}
                />
                {channels.length > 0 ? (
                    <div className="channelCardContainer">
                        {channels.map((channel) => (
                            <ChannelCard
                                key={channel._id}
                                channel={channel}
                                numChannels={numChannels}
                                setNumChannels={setNumChannels}
                            />
                        ))}
                    </div>
                ) : (
                    <div>You don't have any channels.</div>
                )}
            </div>
            <div className="hl"></div>
            <UserProfileTab user={user} />
        </div>
    );
}

export default ChannelSidebar;
