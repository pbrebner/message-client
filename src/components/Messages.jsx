import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";

import MessageCard from "./MessageCard";
import MessagesLoading from "./MessagesLoading";
import Button from "../components/Button";
import { formatDateLong } from "../utils/dates.js";
import "./styles/Messages.css";

function Messages() {
    const [messages, setMessages] = useState("");
    const [numMessages, setNumMessages] = useState(0);

    const [newMessage, setNewMessage] = useState("");
    const [inResponseTo, setInResponseTo] = useState(null);
    const inputRef = useRef(null);

    const [uploadFileOpen, setUploadFileOpen] = useState(false);

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
                    replyToMessage={replyToMessage}
                />
            );
        });

        return messageList;
    }

    function getFormData() {
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

    async function createNewMessage(e) {
        e.preventDefault();
        setShowLoader(true);

        setFormError("");
        setError("");

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
                clearReply();

                setNewMessage("");
                let val = numMessages + 1;
                setNumMessages(val);
            }
        } catch (err) {
            setError(err.message);
            setShowLoader(false);
        }
    }

    function replyToMessage(responseObject) {
        // clear newMessage and focus
        setNewMessage("");
        inputRef.current.focus();

        // Set inResponseTo
        setInResponseTo(responseObject);
    }

    function clearReply() {
        setInResponseTo(null);
    }

    function toggleUploadFileModal() {
        uploadFileOpen ? setUploadFileOpen(false) : setUploadFileOpen(true);
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
                            onClick={createNewMessage}
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
