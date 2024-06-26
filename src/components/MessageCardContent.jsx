import { useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import { socket } from "../utils/socket";

import "./styles/MessageCardContent.css";

function MessageCardContent({
    message,
    editMessage,
    setEditMessage,
    numMessageUpdates,
    setNumMessageUpdates,
    inputRef,
}) {
    const [editContent, setEditContent] = useState(message.content);
    const [formError, setFormError] = useState("");

    const { channelId } = useParams();

    const [
        user,
        numChannels,
        setNumChannels,
        updateChannel,
        setUpdateChannel,
        numFriends,
        setNumFriends,
        setError,
    ] = useOutletContext();

    // Based on key input, runs edit or cancels edit
    function handleEditCommand(e) {
        if (e.key == "Enter") {
            e.preventDefault();
            runEdit();
        } else if (e.key == "Escape") {
            cancelEdit();
        }
    }

    function cancelEdit() {
        setEditMessage(false);
        setEditContent(message.content);
        setFormError("");
    }

    function runEdit() {
        if (editContent != message.content) {
            updateMessage();
        } else {
            setEditMessage(false);
        }
    }

    // Sends request to update message
    async function updateMessage() {
        setError("");
        setFormError("");

        const bodyData = JSON.stringify({
            content: editContent,
        });

        // Make request to update message content
        try {
            const response = await fetch(
                `https://message-api.fly.dev/api/channels/${channelId}/messages/${message._id}`,
                {
                    method: "put",
                    body: bodyData,
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            const result = await response.json();
            //console.log(result);

            // handle fetch response
            if (response.status == "401") {
                // Invalid Token
                navigate("/message-client/login", {
                    state: { message: "Your Session Timed Out." },
                });
            } else if (response.status == 400) {
                setFormError(result.errors);
            } else if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            } else {
                setEditMessage(false);
                setNumMessageUpdates(numMessageUpdates + 1);

                // Emit updateMessage to socket, triggers message fetch for all current users in channel
                socket.emit("updateMessage", { room: channelId });
            }
        } catch (err) {
            setError(err.message);

            setEditMessage(false);
            setEditContent(message.content);
        }
    }

    return (
        <div className="messageContent">
            {(message.content || message.image) && (
                <div className="messageTextContainer">
                    <form
                        className={`editTextForm ${
                            editMessage ? "display" : ""
                        }`}
                    >
                        <div className="editTextContainer">
                            <TextareaAutosize
                                name="editText"
                                id="editText"
                                className="editText"
                                placeholder="Edit Message"
                                minRows={1}
                                maxRows={15}
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                onKeyDown={handleEditCommand}
                                ref={inputRef}
                            />
                        </div>
                        <div className="editTextInfo">
                            escape to{" "}
                            <button
                                className="editTextBtn"
                                onClick={(e) => {
                                    e.preventDefault();
                                    cancelEdit();
                                }}
                            >
                                cancel
                            </button>
                            , enter to{" "}
                            <button
                                className="editTextBtn"
                                onClick={(e) => {
                                    e.preventDefault();
                                    runEdit();
                                }}
                            >
                                save
                            </button>
                        </div>
                        {formError && (
                            <div className="newMessageError">
                                {formError.map((error, index) => (
                                    <div key={index}>{error.msg}</div>
                                ))}
                            </div>
                        )}
                    </form>
                    <p
                        className={`messageText ${
                            editMessage ? "" : "display"
                        }`}
                    >
                        {message.content}
                    </p>
                </div>
            )}
            {message.image && (
                <img
                    src={message.imageURL}
                    alt="Message Image"
                    className="messageImage"
                />
            )}
        </div>
    );
}

export default MessageCardContent;
