import { useState, useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

import ChannelHeader from "./ChannelHeader";
import Messages from "./Messages";
import UserSidebar from "./UserSidebar";

//import "../pages/styles/Channels.css";

function ChannelSection() {
    const [channel, setChannel] = useState("");
    const [otherUsers, setOtherUsers] = useState([]);

    const [friends, setFriends] = useState("");

    const [pageLoading, setPageLoading] = useState(true);
    const { channelId } = useParams();
    const [
        user,
        numChannels,
        setNumChannels,
        numChannelUpdates,
        setNumChannelUpdates,
        numFriends,
        setNumFriends,
        setError,
    ] = useOutletContext();
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();

    //Get channel
    useEffect(() => {
        async function getChannel() {
            setPageLoading(true);
            try {
                const response = await fetch(
                    `https://message-api.fly.dev/api/channels/${channelId}`,
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
                    navigate("/message-client/login");
                } else if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                } else {
                    setChannel(data);
                    getOtherUsers(data.users);
                    setError("");
                }
            } catch (err) {
                setError(err.message);

                setTimeout(() => {
                    setPageLoading(false);
                }, "1500");
            }
        }
        getChannel();
    }, [channelId, numChannelUpdates]);

    // Gets all other channel users
    function getOtherUsers(users) {
        const channelUsersTemp = users.filter(
            (channelUser) => channelUser._id != userId
        );

        setOtherUsers(channelUsersTemp);
    }

    // Fetch user friends
    useEffect(() => {
        async function getFriends() {
            setError("");

            try {
                const response = await fetch(
                    `https://message-api.fly.dev/api/users/${localStorage.getItem(
                        "userId"
                    )}/friends`,
                    {
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

                if (response.status == "401") {
                    // Invalid Token
                    navigate("/message-client/login");
                } else if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                } else {
                    setFriends(result);
                }
            } catch (err) {
                setError(err.message);
            }
        }
        getFriends();
    }, [numFriends]);

    return (
        <div className="channelSection">
            <ChannelHeader
                otherUsers={otherUsers}
                channel={channel}
                friends={friends}
                pageLoading={pageLoading}
            />
            <div className="hl"></div>
            <div className="channelMain">
                <Messages otherUsers={otherUsers} channel={channel} />
                <div className="vl"></div>
                <UserSidebar
                    otherUsers={otherUsers}
                    pageLoading={pageLoading}
                />
            </div>
        </div>
    );
}

export default ChannelSection;
