import "./styles/MessagesHeader.css";

function MessagesHeader({ otherUsers, channel }) {
    return (
        <>
            {otherUsers.length == 1 ? (
                <div className="messagesHeader">
                    <div className="messagesHeaderImage">
                        <img src={otherUsers[0].avatarURL} alt="User Avatar" />
                    </div>
                    <div className="messagesHeaderName">
                        {otherUsers[0].name}
                    </div>
                    <div className="messagesHeaderStatement">
                        This is the begining of your direct message history.
                    </div>
                </div>
            ) : (
                <div className="messagesHeader">
                    {channel.title ? (
                        <div className="messagesHeaderTitle">
                            {channel.title}
                        </div>
                    ) : (
                        <div className="messagesHeaderTitle">Group Chat</div>
                    )}
                    <div className="messagesHeaderStatement">
                        This is the begining of your direct message history.
                    </div>
                </div>
            )}
        </>
    );
}

export default MessagesHeader;
