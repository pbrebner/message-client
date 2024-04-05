import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";

import MessagesHeader from "./MessagesHeader.jsx";
import MessageCard from "./MessageCard";
import MessagesLoading from "./MessagesLoading";
import Button from "../components/Button";
import { formatDateLong } from "../utils/dates.js";
import "./styles/Messages.css";

function Messages({ otherUsers, channel }) {
    const [messages, setMessages] = useState([]);
    const [numMessageUpdates, setNumMessageUpdates] = useState(0);

    const [newMessage, setNewMessage] = useState("");
    const [inResponseTo, setInResponseTo] = useState(null);
    const inputRef = useRef(null);

    const [uploadFileOpen, setUploadFileOpen] = useState(false);
    const [newMessageImage, setNewMessageImage] = useState("");
    const [newMessageInfo, setNewMessageInfo] = useState(null);

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
        numFriends,
        setNumFriends,
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
                //console.log(data);

                setTimeout(() => {
                    setPageLoading(false);
                }, "1500");

                if (response.status == "401") {
                    // Invalid Token
                    navigate("/message-client/login", {
                        state: { message: "Your Session Timed Out." },
                    });
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
        cleanUpMessage();
        getMessages();
        return () => cleanUpMessage();
    }, [numMessageUpdates, channelId]);

    // Prepares messageCards for display (Adds date lines if required)
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
                    message={message}
                    numMessageUpdates={numMessageUpdates}
                    setNumMessageUpdates={setNumMessageUpdates}
                    prepareReply={prepareReply}
                />
            );
        });

        return messageList;
    }

    // Prepares file for upload and creates new message
    async function handleFileUpload(e) {
        if (newMessageInfo) {
            await deleteMessage();
        }

        setNewMessageImage(e.target.files[0]);
        toggleUploadFileModal();

        setShowLoader(true);
        setFormError("");
        setError("");

        let formData = new FormData();
        formData.append("image", e.target.files[0]);

        // Reset value
        e.target.value = "";

        const result = await createNewMessage(formData);

        if (result) {
            setNewMessageInfo({
                messageId: result.messageId,
                imageURL: result.messageImageURL,
            });
        }
    }

    // Handles logic to either update or create new messages on send
    async function handleMessageSend(e) {
        e.preventDefault();
        setShowLoader(true);
        setFormError("");
        setError("");

        if (newMessageInfo) {
            // Update the message
            const formData = getSendData();
            const result = await updateMessage(formData);
            if (result) {
                clearReply();
                setNewMessage("");
                setNumMessageUpdates(numMessageUpdates + 1);

                setNewMessageInfo(null);
            }
        } else {
            // Create new message
            let formData = new FormData();
            formData.append("content", newMessage);

            if (inResponseTo) {
                formData.append("inResponseTo", inResponseTo.replyId);
            }

            const result = await createNewMessage(formData);
            if (result) {
                clearReply();
                setNewMessage("");
                setNumMessageUpdates(numMessageUpdates + 1);
            }
        }
    }

    function getSendData() {
        if (inResponseTo) {
            return JSON.stringify({
                content: newMessage,
                inResponseTo: inResponseTo.replyId,
            });
        } else {
            return JSON.stringify({
                content: newMessage,
            });
        }
    }

    // Cleans up by deleting message if not sent
    async function cleanUpMessage() {
        setNewMessage("");
        setInResponseTo(null);

        if (newMessageInfo) {
            await deleteMessage();
        }
    }

    async function createNewMessage(formData) {
        // Make request to create new Message
        try {
            const response = await fetch(
                `https://message-api.fly.dev/api/channels/${channelId}/messages`,
                {
                    method: "post",
                    body: formData,
                    headers: {
                        authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            const result = await response.json();
            //console.log(result);

            setShowLoader(false);

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
                return result;
            }
        } catch (err) {
            setError(err.message);
            setShowLoader(false);
        }
    }

    async function updateMessage(formData) {
        // Make request to update message content
        try {
            const response = await fetch(
                `https://message-api.fly.dev/api/channels/${channelId}/messages/${newMessageInfo.messageId}`,
                {
                    method: "put",
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
            //console.log(result);

            setShowLoader(false);

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
                return result;
            }
        } catch (err) {
            setShowLoader(false);
            setError(err.message);
        }
    }

    async function deleteMessage() {
        setError("");

        // Make request to delete message
        try {
            const response = await fetch(
                `https://message-api.fly.dev/api/channels/${channelId}/messages/${newMessageInfo.messageId}`,
                {
                    method: "delete",
                    headers: {
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
            } else if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            } else {
                setNewMessageInfo(null);
            }
        } catch (err) {
            setError(err.message);
        }
    }

    function toggleUploadFileModal() {
        uploadFileOpen ? setUploadFileOpen(false) : setUploadFileOpen(true);
    }

    function prepareReply(responseObject) {
        // clear newMessage and focus
        setNewMessage("");
        inputRef.current.focus();

        // Set inResponseTo
        setInResponseTo(responseObject);
    }

    function clearReply() {
        setInResponseTo(null);
    }

    return (
        <div className="messagesSection">
            <div className="messagesContainer">
                {pageLoading && <MessagesLoading />}
                <MessagesHeader otherUsers={otherUsers} channel={channel} />
                {messages.length > 0 ? messages : <div></div>}
            </div>
            <div className="newMessageContainer">
                <div className="newMessageDisplay">
                    {inResponseTo && (
                        <div className="inResponseContainer">
                            <div>
                                Replying to{" "}
                                <span>{inResponseTo.replyName}</span>
                            </div>
                            <button onClick={clearReply}>&#x2715;</button>
                        </div>
                    )}
                    {newMessageInfo && (
                        <div className="newMessageImageContainer">
                            <img
                                src={newMessageInfo.imageURL}
                                alt="New Message Image"
                                className="newMessageImage"
                            />
                            <div className="newMessageImageBtns">
                                <button onClick={deleteMessage}>X</button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="newMessageInput">
                    <button
                        className="uploadFileBtn"
                        onClick={toggleUploadFileModal}
                    >
                        +
                    </button>
                    <form className="newMessageForm">
                        <TextareaAutosize
                            name="newMessage"
                            id="newMessage"
                            className="newMessage"
                            placeholder="New Message"
                            minRows={1}
                            maxRows={15}
                            value={newMessage}
                            onChange={(e) => {
                                setFormError("");
                                setNewMessage(e.target.value);
                            }}
                            ref={inputRef}
                        />
                        <div className="newMessageFormDivider"></div>
                        <Button
                            onClick={handleMessageSend}
                            text="Send"
                            loading={showLoader}
                            disabled={showLoader}
                        />
                    </form>
                    <div
                        className={`uploadFileModal ${
                            uploadFileOpen ? "display" : ""
                        }`}
                    >
                        <label
                            htmlFor="fileUpload"
                            className="uploadFileModalBtn"
                        >
                            Upload a File
                        </label>
                        <input
                            type="file"
                            name="fileUpload"
                            id="fileUpload"
                            className="fileUpload"
                            file={newMessageImage}
                            onChange={handleFileUpload}
                            accept="image/*"
                        />
                    </div>
                </div>
                {formError && (
                    <div className="newMessageError">
                        {formError.map((error, index) => (
                            <div key={index}>{error.msg}</div>
                        ))}
                    </div>
                )}
            </div>

            <div
                className={`overlay ${uploadFileOpen ? "display" : ""}`}
                onClick={toggleUploadFileModal}
            ></div>
        </div>
    );
}

export default Messages;
