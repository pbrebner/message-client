import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import DirectMessagesHeader from "./DirectMessagesHeader";
import ChannelCard from "./ChannelCard";
import "./styles/ChannelSidebar.css";

function ChannelSidebar() {
    const [channels, setChannels] = useState("");
    const [numChannels, setNumChannels] = useState(0);

    const [newChannelOpen, setNewChannelOpen] = useState(false);

    const userId = localStorage.getItem("userId");

    const [formError, setFormError] = useState("");
    const [error, setError] = useState("");

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

                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                }

                const data = await response.json();
                console.log(data);

                setChannels(data);
                setError("");
            } catch (err) {
                setError(err.message);
                setUser("");
            }
        }
        getChannels();
    }, [numChannels]);

    // Removes the users own value from channel
    function getFilteredChannels(channels) {
        channels.map((channel) => {
            channel.users = channel.users.filter((user) => user._id != userId);
        });

        return channels;
    }

    //TODO: Create a channel search function

    function openNewChannel() {
        setNewChannelOpen(true);
    }

    function closeNewChannel() {
        setNewChannelOpen(false);
    }

    //TODO: Add scroll bar on cardContainer during overflow
    return (
        <div className="channelSidebar">
            <div className="channelSidebarHeader">
                <form className="channelSearchForm">
                    <input
                        type="text"
                        name="channelSearch"
                        id="channelSearch"
                        className="channelSearch"
                        placeholder="Find a conversation"
                    />
                </form>
            </div>
            <div className="hl"></div>
            <div className="channelSidebarMain">
                <Link to="../channels" className="channelSidebarLink">
                    Friends
                </Link>
                <DirectMessagesHeader
                    newChannelOpen={newChannelOpen}
                    openNewChannel={openNewChannel}
                    closeNewChannel={closeNewChannel}
                    numChannels={numChannels}
                    setNumChannels={setNumChannels}
                />
                {channels.length > 0 ? (
                    <div className="channelCardContainer">
                        {channels.map((channel) => (
                            <ChannelCard key={channel._id} channel={channel} />
                        ))}
                    </div>
                ) : (
                    <div>You don't have any channels.</div>
                )}
            </div>
            <div
                className={`overlay ${newChannelOpen ? "display" : ""}`}
                onClick={closeNewChannel}
            ></div>
        </div>
    );
}

export default ChannelSidebar;
