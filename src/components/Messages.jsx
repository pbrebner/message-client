import { useState, useEffect } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";

import MessageCard from "./MessageCard";
import Button from "../components/Button";
import "./styles/Messages.css";

function Messages() {
    const [messages, setMessages] = useState("");
    const [numMessages, setNumMessages] = useState(0);
    const [newMessage, setNewMessage] = useState("");

    const [showLoader, setShowLoader] = useState(false);

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

                if (response.status == "401") {
                    // Invalid Token
                    navigate("/message-client/login");
                } else if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                } else {
                    setMessages(data);
                    setError("");
                }
            } catch (err) {
                setError(err.message);
            }
        }
        getMessages();
    }, [numMessages, channelId]);

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
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <MessageCard
                            key={message._id}
                            channelId={channelId}
                            message={message}
                            numMessages={numMessages}
                            setNumMessages={setNumMessages}
                        />
                    ))
                ) : (
                    <div>No messages yet</div>
                )}
            </div>
            <form className="newMessageForm">
                <input
                    type="text"
                    name="newMessage"
                    id="newMessage"
                    placeholder="New Message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
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
