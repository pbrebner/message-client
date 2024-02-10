import { Link } from "react-router-dom";

import "./styles/ChannelCard.css";

function ChannelCard({ channel }) {
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
        <div className="channelCard">
            <Link
                to={`../messages/${channel._id}`}
                className="channelCardInnerContainer"
            >
                <div className="channelCardImage">Img</div>
                {channel.title ? (
                    <div className="channelCardText">{channel.title}</div>
                ) : (
                    <div className="channelCardText">{channelUsers}</div>
                )}
            </Link>
            <button className="deleteChannelCard" onClick={deleteChannel}>
                &#x2715;
            </button>
        </div>
    );
}

export default ChannelCard;
