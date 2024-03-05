import { useState, useEffect } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";

import MessageCard from "./MessageCard";
import MessagesLoading from "./MessagesLoading";
import Button from "../components/Button";
import { formatDateLong } from "../utils/dates.js";
import "./styles/Messages.css";

function Messages() {
    const [messages, setMessages] = useState("");
    const [numMessages, setNumMessages] = useState(0);
    const [newMessage, setNewMessage] = useState("");

    const [showLoader, setShowLoader] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [channelCheckId, setChannelCheckId] = useState("");

    const [formError, setFormError] = useState("");
    const [
        user,
        numChannels,
        setNumChannels,
        updateChannel,
        setUpdateChannel,
        setError,
    ] = useOutletContext();

    const { channelId } = useParams();
    const navigate = useNavigate();

    //Get all Channel Messages
    useEffect(() => {
        async function getMessages() {
            // Trigger pageloading only when channel changes
            if (channelCheckId != channelId) {
                setPageLoading(true);
                setChannelCheckId(channelId);
            }

            try {
                const response = await fetch(
                    `https://message-api.fly.dev/api/channels/${channelId}/messages`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );

                const data = await response.json();
                console.log(data);

                setTimeout(() => {
                    setPageLoading(false);
                }, "1500");

                if (response.status == "401") {
                    // Invalid Token
                    navigate("/message-client/login");
                } else if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                } else {
                    setMessages(prepareMessages(data));
                    setError("");
                }
            } catch (err) {
                setError(err.message);
                setTimeout(() => {
                    setPageLoading(false);
                }, "1500");
            }
        }
        getMessages();
    }, [numMessages, channelId]);

    function prepareMessages(messages) {
        let messageList = [];
        let messageDate = "";

        messages.forEach((message, index) => {
            if (
                !messageDate ||
                formatDateLong(message.timeStamp) > formatDateLong(messageDate)
            ) {
                messageList.push(
                    <div key={index} className="messagesDivider">
                        <div className="messagesDividerLine"></div>
                        <div className="messagesDividerDate">
                            {formatDateLong(message.timeStamp)}
                        </div>
                        <div className="messagesDividerLine"></div>
                    </div>
                );
                messageDate = message.timeStamp;
            }

            messageList.push(
                <MessageCard
                    key={message._id}
                    channelId={channelId}
                    message={message}
                    numMessages={numMessages}
                    setNumMessages={setNumMessages}
                />
            );
        });

        return messageList;
    }

    async function createNewMessage(e) {
        e.preventDefault();
        setShowLoader(true);

        setFormError("");
        setError("");

        const formData = JSON.stringify({
            content: newMessage,
        });

        // Make request to create new Message
        try {
            const response = await fetch(
                `https://message-api.fly.dev/api/channels/${channelId}/messages`,
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

            const result = await response.json();
            console.log(result);

            setShowLoader(false);

            // Handle any errors
            if (response.status == 400) {
                setFormError(result.errors);
            } else if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            } else {
                setNewMessage("");
                let val = numMessages + 1;
                setNumMessages(val);
            }
        } catch (err) {
            setError(err.message);
            setShowLoader(false);
        }
    }

    return (
        <div className="messagesSection">
            <div className="messagesContainer">
                {pageLoading && <MessagesLoading />}
                {messages.length > 0 ? messages : <div>No messages yet</div>}
            </div>
            <form className="newMessageForm">
                <input
                    type="text"
                    name="newMessage"
                    id="newMessage"
                    placeholder="New Message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    autoComplete="off"
                />
                <div className="newMessageFormDivider"></div>
                <Button
                    onClick={createNewMessage}
                    text="Send"
                    loading={showLoader}
                    disabled={showLoader}
                />
            </form>
            {formError && (
                <div className="newMessageError">
                    {formError.map((error) => (
                        <div>{error.msg}</div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Messages;
