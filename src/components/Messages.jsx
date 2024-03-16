import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";

import MessageCard from "./MessageCard";
import MessagesLoading from "./MessagesLoading";
import Button from "../components/Button";
import { formatDateLong } from "../utils/dates.js";
import "./styles/Messages.css";

function Messages() {
    const [messages, setMessages] = useState([]);
    const [numMessageUpdates, setNumMessageUpdates] = useState(0);

    const [newMessage, setNewMessage] = useState("");
    const [inResponseTo, setInResponseTo] = useState(null);
    const inputRef = useRef(null);

    const [uploadFileOpen, setUploadFileOpen] = useState(false);
    const [newMessageImage, setNewMessageImage] = useState("");
    const [newMessageInfo, setnewMessageInfo] = useState(null);

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
    }, [numMessageUpdates, channelId]);

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

    async function handleFileUpload(e) {
        // Probably something I need to do to stop regular file upload behavior

        setShowLoader(true);
        setFormError("");
        setError("");

        await createNewMessage();
    }

    async function handleMessageSend(e) {
        e.preventDefault();
        setShowLoader(true);
        setFormError("");
        setError("");

        if (newMessageInfo) {
            // Update the message
            await updateMessage();
        } else {
            // Create new message
            await createNewMessage();
        }
    }

    function getFormData() {
        let formData = new FormData();

        // Set formData
        if (newMessageImage) {
            formData.append("image", newMessageImage);
        } else {
            formData.append("content", newMessage);

            if (inResponseTo) {
                formData.append("inResponseTo", inResponseTo.replyId);
            }
        }

        return formData;
    }

    function cleanUpMessage(result) {
        if (newMessageImage) {
            setnewMessageInfo({ messageId: result.messageId, imageURL: "" });
            setNewMessageImage("");
        } else {
            clearReply();
            setNewMessage("");
            setNumMessageUpdates(numMessageUpdates + 1);
        }
    }

    async function createNewMessage() {
        const formData = getFormData();

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
                cleanUpMessage(result);
            }
        } catch (err) {
            setError(err.message);
            setShowLoader(false);
        }
    }

    async function updateMessage() {
        const formData = getFormData();

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
                cleanUpMessage();
                setnewMessageInfo(null);
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
                setnewMessageInfo(null);
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
                {messages.length > 0 ? messages : <div>No messages yet</div>}
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
                            onChange={(e) => setNewMessage(e.target.value)}
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
                        <button className="uploadFileModalBtn">
                            Upload a File
                        </button>
                    </div>
                </div>
                {formError && (
                    <div className="newMessageError">
                        {formError.map((error) => (
                            <div>{error.msg}</div>
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
