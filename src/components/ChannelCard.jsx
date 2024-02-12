import { useState } from "react";
import { Link } from "react-router-dom";

import "./styles/ChannelCard.css";

function ChannelCard({ channel }) {
    const [hover, setHover] = useState(false);

    let channelUsers = "";
    channel.users.forEach((user, index) => {
        if (index != 0) {
            channelUsers = channelUsers + ", " + user.name;
        } else {
            channelUsers = channelUsers + user.name;
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
                <div className="channelCardImage">Img</div>
                {channel.title ? (
                    <div className="channelCardText">{channel.title}</div>
                ) : (
                    <div className="channelCardText">{channelUsers}</div>
                )}
            </Link>
            <button
                className={`deleteChannelCardBtn ${hover ? "display" : ""}`}
                onClick={deleteChannel}
            >
                &#x2715;
            </button>
        </div>
    );
}

export default ChannelCard;
