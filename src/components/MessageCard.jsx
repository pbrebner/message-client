import { useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";

import { formatDateTime } from "../utils/dates.js";
import like from "../assets/icons/like.png";
import reply from "../assets/icons/reply2.png";
import "./styles/MessageCard.css";

function MessageCard({
    channelId,
    message,
    numMessageUpdates,
    setNumMessageUpdates,
    replyToMessage,
}) {
    const [hover, setHover] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [messageLikes, setMessageLikes] = useState(message.likes);

    const [editMessage, setEditMessage] = useState(false);
    const [editContent, setEditContent] = useState(message.content);
    const inputRef = useRef(null);
    const [formError, setFormError] = useState("");

    const userId = localStorage.getItem("userId");

    const [
        user,
        numChannels,
        setNumChannels,
        updateChannel,
        setUpdateChannel,
        setError,
    ] = useOutletContext();

    async function likeMessage() {
        let likes = messageLikes + 1;
        setMessageLikes(likes);

        setError("");

        const bodyData = JSON.stringify({
            likes: likes,
        });

        // Make request to update message likes
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
            console.log(result);

            if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            } else {
                setNumMessageUpdates(numMessageUpdates + 1);
            }
        } catch (err) {
            setError(err.message);
        }
    }

    function prepareEditMessage() {
        toggleModal();
        setEditMessage(true);
        inputRef.current.focus();
    }

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
            console.log(result);

            // Handle any errors
            if (response.status == 400) {
                setFormError(result.errors);
            } else if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            } else {
                setEditMessage(false);
                setNumMessageUpdates(numMessageUpdates + 1);
            }
        } catch (err) {
            setError(err.message);

            setEditMessage(false);
            setEditContent(message.content);
        }
    }

    async function deleteMessage() {
        setError("");

        // Make request to delete message
        try {
            const response = await fetch(
                `https://message-api.fly.dev/api/channels/${channelId}/messages/${message._id}`,
                {
                    method: "delete",
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

            toggleModal();

            if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            } else {
                setNumMessageUpdates(numMessageUpdates + 1);
            }
        } catch (err) {
            setError(err.message);
            toggleModal();
        }
    }

    function replyMessage() {
        toggleModal();
        replyToMessage({ replyId: message._id, replyName: message.user.name });
    }

    function toggleModal() {
        modalOpen ? setModalOpen(false) : setModalOpen(true);
    }

    return (
        <div
            id={message._id}
            className={`messageCard ${hover || modalOpen ? "hover" : ""}`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => setHover(true)}
        >
            {message.inResponseTo && (
                <>
                    <div className="reply">
                        <img src={reply} />
                    </div>
                    <div className="inResponseTo">
                        <div className="inResponseToName">
                            {message.inResponseTo.user.name}
                        </div>
                        <a
                            href={`#${message.inResponseTo._id}`}
                            className="inResponseToContent"
                        >
                            {message.inResponseTo.content}
                        </a>
                    </div>
                </>
            )}

            <div className="messageImageContainer">
                <img
                    src={message.user.avatarURL}
                    alt="User"
                    className="messageImage"
                />
            </div>
            <div className="message">
                <div className="messageHeader">
                    <div className="messageUser">{message.user.name}</div>
                    <div className="messageDate">
                        {formatDateTime(message.timeStamp)}
                    </div>
                </div>
                {message.content && (
                    <div className="messageContents">
                        <form
                            className={`editContentForm ${
                                editMessage ? "display" : ""
                            }`}
                        >
                            <div className="editContentContainer">
                                <TextareaAutosize
                                    name="editContent"
                                    id="editContent"
                                    className="editContent"
                                    placeholder="Edit Message"
                                    minRows={1}
                                    maxRows={15}
                                    value={editContent}
                                    onChange={(e) =>
                                        setEditContent(e.target.value)
                                    }
                                    onKeyDown={handleEditCommand}
                                    ref={inputRef}
                                />
                            </div>
                            <div className="editContentInfo">
                                escape to{" "}
                                <button
                                    className="editContentBtn"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        cancelEdit();
                                    }}
                                >
                                    cancel
                                </button>
                                , enter to{" "}
                                <button
                                    className="editContentBtn"
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
                                    {formError.map((error) => (
                                        <div>{error.msg}</div>
                                    ))}
                                </div>
                            )}
                        </form>
                        <p
                            className={`messageContent ${
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
                {messageLikes > 0 && (
                    <div className="messageLikes">
                        <img src={like} />
                        <div>{messageLikes}</div>
                    </div>
                )}
            </div>

            <div
                className={`messageCardBtns ${
                    hover || modalOpen ? "display" : ""
                }`}
            >
                <button className="reactBtn" onClick={likeMessage} title="Like">
                    <img src={like} />
                </button>
                <button className="moreBtn" onClick={toggleModal} title="More">
                    &#8230;{" "}
                </button>
            </div>
            <div className={`messageCardModal ${modalOpen ? "display" : ""}`}>
                <button className="messageCardModalBtn" onClick={replyMessage}>
                    Reply
                </button>
                {message.user._id == userId && (
                    <>
                        <button
                            className="messageCardModalBtn"
                            onClick={prepareEditMessage}
                        >
                            Edit
                        </button>
                        <button
                            className="messageCardModalBtn deleteMessageBtn"
                            onClick={deleteMessage}
                        >
                            Delete
                        </button>
                    </>
                )}
            </div>
            <div
                className={`overlay ${modalOpen ? "display" : ""}`}
                onClick={toggleModal}
            ></div>
        </div>
    );
}

export default MessageCard;
