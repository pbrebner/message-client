import { useState } from "react";
import { Link } from "react-router-dom";

import "./styles/ChannelCard.css";

function ChannelCard({ channel }) {
    const [hover, setHover] = useState(false);

    const userId = localStorage.getItem("userId");

    const filteredChannelUsers = channel.users.filter(
        (user) => user._id != userId
    );
    console.log(filteredChannelUsers);
    let channelUserNames = "";
    filteredChannelUsers.forEach((user, index) => {
        if (index != 0) {
            channelUserNames = channelUserNames + ", " + user.name;
        } else {
            channelUserNames = channelUserNames + user.name;
        }
    });

    function deleteChannel() {
        console.log("Deleting Channel");
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
                {filteredChannelUsers.length > 0 ? (
                    <div className="channelCardImg">
                        <img src={filteredChannelUsers[0].avatar} />
                    </div>
                ) : (
                    <div className="channelCardImg">
                        <img src={filteredChannelUsers[0].avatar} />
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
