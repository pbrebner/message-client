import "./styles/ChannelHeader.css";

function ChannelHeader({ otherUsers }) {
    return (
        <div className="channelHeader">
            <div className="channelHeaderUsers">
                {otherUsers &&
                    otherUsers.map((user) => (
                        <div key={user._id} className="channelHeaderUser">
                            <div className="channelHeaderUserImg">
                                <img src={user.avatar} />
                            </div>
                            <div> {user.name}</div>
                        </div>
                    ))}
            </div>
            <div className="channelHeaderActions">
                <button className="channelHeaderBtn">Add user to DM</button>
            </div>
        </div>
    );
}

export default ChannelHeader;
