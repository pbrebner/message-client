import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./styles/ChannelCard.css";

function ChannelCard({ channel, numChannels, setNumChannels }) {
    const [hover, setHover] = useState(false);

    const [error, setError] = useState("");

    // This runs on every render change
    let channelUserNames = "";
    channel.users.forEach((user, index) => {
        if (index != 0) {
            channelUserNames = channelUserNames + ", " + user.name;
        } else {
            channelUserNames = channelUserNames + user.name;
        }
    });

    async function deleteChannel() {
        setError("");

        // Make request to delete channel
        try {
            const response = await fetch(
                `https://message-api.fly.dev/api/channels/${channel._id}`,
                {
                    method: "delete",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            const result = await response.json();
            console.log(result);

            if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            } else {
                let val = numChannels - 1;
                setNumChannels(val);
            }
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div
            className="channelCard"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <Link
                to={`../channels/${channel._id}`}
                className="channelCardInnerContainer"
            >
                {channel.users.length > 0 ? (
                    <div className="channelCardImg">
                        <img src={channel.users[0].avatarURL} />
                    </div>
                ) : (
                    <div className="channelCardImg">
                        <img src={channel.users[0].avatarURL} />
                    </div>
                )}
                {channel.title ? (
                    <div className="channelCardText">{channel.title}</div>
                ) : (
                    <div className="channelCardText">{channelUserNames}</div>
                )}
            </Link>
            <button
                className={`deleteChannelCardBtn ${hover ? "display" : ""}`}
                onClick={deleteChannel}
                title="Delete Channel"
            >
                &#x2715;
            </button>
        </div>
    );
}

export default ChannelCard;
