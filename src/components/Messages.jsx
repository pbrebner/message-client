import { useState, useEffect } from "react";

import MessageCard from "./MessageCard";

function Messages({ selectedChannel }) {
    const [messages, setMessages] = useState("");
    const [numMessages, setNumMessages] = useState(0);
    const [newMessage, setNewMessage] = useState("");

    const [formError, setFormError] = useState("");
    const [error, setError] = useState("");

    //Get all Channel Messages
    useEffect(() => {
        async function getMessages() {
            try {
                const response = await fetch(
                    `https://message-api.fly.dev/api/channels/${selectedChannel._id}/messages`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                }

                const data = await response.json();
                console.log(data);

                setMessages(data);
                setError("");
            } catch (err) {
                setError(err.message);
                setUser("");
            }
        }
        getMessages();
    }, [numMessages]);

    async function createNewMessage(e) {
        e.preventDefault();

        setFormError("");
        setError("");

        const formData = JSON.stringify({
            content: newMessage,
        });

        // Make request to create new Message
        try {
            const response = await fetch(
                `https://message-api.fly.dev/api/channels/${selectedChannel._id}/messages`,
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

            console.log(response);
            const result = await response.json();
            console.log(result);

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
        }
    }

    return (
        <div className="messages">
            <MessageCard />
            <form className="newMessageForm">
                <div className="formElement">
                    <input
                        type="text"
                        name="message"
                        id="message"
                        placeholder="New Message"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                </div>
            </form>
        </div>
    );
}

export default Messages;
