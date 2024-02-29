import "./styles/MessagesLoading.css";

function MessagesLoading() {
    const messageLoadingElements = [];
    for (let i = 0; i < 20; i++) {
        messageLoadingElements.push(
            <div key={i} className="messageCardLoader">
                <div className="messageCardLoaderImage"></div>
                <div className="messageCardLoaderText">
                    <div className="messageCardLoaderHeader"></div>
                    <div className="messageCardLoaderContent"></div>
                    <div className="messageCardLoaderContent"></div>
                </div>
            </div>
        );
    }

    return <div className="messagesLoading">{messageLoadingElements}</div>;
}

export default MessagesLoading;
