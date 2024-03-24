import { useState, useEffect } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

import ChannelSearch from "./ChannelSearch";
import DirectMessagesHeader from "./DirectMessagesHeader";
import ChannelCard from "./ChannelCard";
import UserProfileTab from "./UserProfileTab";
import backArrow from "../assets/icons/back.png";
import "./styles/ChannelSidebar.css";

function ChannelSidebar({
    user,
    numChannels,
    setNumChannels,
    numChannelUpdates,
    numFriends,
    closeSidebar,
}) {
    const [channels, setChannels] = useState("");
    const [filteredChannels, setFilteredChannels] = useState([]);

    const [friends, setFriends] = useState("");

    const [loggedIn, setLoggedIn, setError] = useOutletContext();
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

                const result = await response.json();
                //console.log(result);

                if (response.status == "401") {
                    // Invalid Token
                    navigate("/message-client/login");
                } else if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                } else {
                    setChannels(removeChannelUser(result));
                    setError("");
                }
            } catch (err) {
                setError(err.message);
            }
        }
        getChannels();
    }, [numChannels, numChannelUpdates]);

    // Removes the users own value from channel
    function removeChannelUser(channels) {
        channels.map((channel) => {
            channel.users = channel.users.filter((user) => user._id != userId);
        });

        return channels;
    }

    // Fetch user friends
    useEffect(() => {
        async function getFriends() {
            setError("");

            try {
                const response = await fetch(
                    `https://message-api.fly.dev/api/users/${localStorage.getItem(
                        "userId"
                    )}/friends`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );

                const result = await response.json();
                //console.log(result);

                if (response.status == "401") {
                    // Invalid Token
                    navigate("/message-client/login");
                } else if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                } else {
                    setFriends(result);
                }
            } catch (err) {
                setError(err.message);
            }
        }
        getFriends();
    }, [numFriends]);

    return (
        <div className="channelSidebar">
            <div className="channelSidebarHeader">
                <ChannelSearch
                    channels={channels}
                    setFilteredChannels={setFilteredChannels}
                />
                <button className="closeSidebarBtn" onClick={closeSidebar}>
                    <img src={backArrow} />
                </button>
            </div>
            <div className="hl"></div>
            <div className="channelSidebarMain">
                <Link
                    to="../channels"
                    onClick={closeSidebar}
                    className="channelSidebarLink"
                >
                    Friends
                </Link>
                <DirectMessagesHeader
                    numChannels={numChannels}
                    setNumChannels={setNumChannels}
                    friends={friends}
                    closeSidebar={closeSidebar}
                />
                {channels.length > 0 ? (
                    <div className="channels">
                        {filteredChannels.length > 0 ? (
                            <div className="channelCardContainer">
                                {filteredChannels.map((channel) => (
                                    <ChannelCard
                                        key={channel._id}
                                        channel={channel}
                                        numChannels={numChannels}
                                        setNumChannels={setNumChannels}
                                        closeSidebar={closeSidebar}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="channelCardContainer">
                                {channels.map((channel) => (
                                    <ChannelCard
                                        key={channel._id}
                                        channel={channel}
                                        numChannels={numChannels}
                                        setNumChannels={setNumChannels}
                                        closeSidebar={closeSidebar}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="channels"></div>
                )}
            </div>
            <div className="hl"></div>
            <UserProfileTab user={user} closeSidebar={closeSidebar} />
        </div>
    );
}

export default ChannelSidebar;
