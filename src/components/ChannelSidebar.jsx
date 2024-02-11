import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import ChannelCard from "./ChannelCard";
import "./styles/ChannelSidebar.css";

function ChannelSidebar() {
    const [channels, setChannels] = useState("");
    const [numChannels, setNumChannels] = useState(0);

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

    async function createNewChannel(e) {
        e.preventDefault();

        setFormError("");
        setError("");

        const formData = JSON.stringify({
            title: "",
            users: [],
        });

        // Make request to create new Channel
        try {
            const response = await fetch(
                "https://message-api.fly.dev/api/channels",
                {
                    method: "post",
                    body: formData,
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            console.log(response);
            const result = await response.json();
            console.log(result);

            // Handle any errors
            if (response.status == 400) {
                setFormError(result.errors);
            } else if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            } else {
                //setNewMessage("");
                let val = numChannels + 1;
                setNumChannels(val);
            }
        } catch (err) {
            setError(err.message);
        }
    }

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
                <div className="directMessagesHeader">
                    <p>Direct Messages</p>
                    <button onClick={console.log("Creating new channel")}>
                        &#x2B;
                    </button>
                </div>
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
        </div>
    );
}

export default ChannelSidebar;
