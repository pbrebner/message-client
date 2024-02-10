import { useNavigate } from "react-router-dom";

import "./styles/ChannelCard.css";

function ChannelCard({ channel }) {
    const navigate = useNavigate();

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

    function handleClick() {
        navigate(`/message-client/channels/${channel._id}`);
    }

    return (
        <div className="channelCard" onClick={handleClick}>
            <div className="channelCardInnerContainer">
                <div className="channelCardImage">Img</div>
                {channel.title ? (
                    <div className="channelCardText">{channel.title}</div>
                ) : (
                    <div className="channelCardText">{channelUsers}</div>
                )}
            </div>
            <button className="deleteChannelCard" onClick={deleteChannel}>
                &#x2715;
            </button>
        </div>
    );
}

export default ChannelCard;
