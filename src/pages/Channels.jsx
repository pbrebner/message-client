import { useState, useEffect } from "react";
import { useNavigate, Outlet, useOutletContext } from "react-router-dom";
import { socket } from "../utils/socket";

import ChannelSidebar from "../components/ChannelSidebar";
import PageLoader from "../components/PageLoader";
import MenuBtn from "../components/MenuBtn";

import "./styles/Channels.css";

function Channels() {
    const [user, setUser] = useState("");
    const [numChannels, setNumChannels] = useState(0);
    const [numChannelUpdates, setNumChannelUpdates] = useState(0);
    const [numFriends, setNumFriends] = useState(0);

    const [pageLoading, setPageLoading] = useState(true);
    const [showSidebar, setShowSidebar] = useState(false);

    const [loggedIn, setLoggedIn, setError] = useOutletContext();
    const navigate = useNavigate();

    // Fetch the User
    useEffect(() => {
        // Function fetches the user data
        async function getUser() {
            try {
                const response = await fetch(
                    `https://message-api.fly.dev/api/users/${localStorage.getItem(
                        "userId"
                    )}`,
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

                // handle fetch response
                if (response.status == "401") {
                    // Invalid Token
                    socket.emit("offline", {
                        userId: `${localStorage.getItem("userId")}`,
                    });

                    navigate("/message-client/login", {
                        state: { message: "Your Session Timed Out." },
                    });
                } else if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                } else {
                    setUser(data.user);
                    setNumChannels(data.user.channels.length);
                    setNumFriends(data.user.friends.length);
                    setError("");
                }
            } catch (err) {
                setError(err.message);
                setUser("");
            }
        }

        // Emits that user is online and triggers online status change on backend
        socket.emit("online", {
            userId: `${localStorage.getItem("userId")}`,
        });

        // On socket
        socket.on("receiveOnline", getUser);

        // Set timeout for page loading
        setTimeout(() => {
            setPageLoading(false);
        }, "2500");

        return () => {
            socket.off("receiveOnline", getUser);
        };
    }, []);

    function closeSidebar() {
        setShowSidebar(false);
    }

    function openSidebar() {
        setShowSidebar(true);
    }

    return (
        <>
            {pageLoading && <PageLoader />}
            <div className="channelsPage">
                <MenuBtn openSidebar={openSidebar} />
                <div
                    className={`channelSidebarOuterContainer ${
                        showSidebar ? "display" : ""
                    }`}
                >
                    <ChannelSidebar
                        user={user}
                        numChannels={numChannels}
                        setNumChannels={setNumChannels}
                        numChannelUpdates={numChannelUpdates}
                        numFriends={numFriends}
                        closeSidebar={closeSidebar}
                    />
                </div>
                <div className="vl"></div>
                <Outlet
                    context={[
                        user,
                        numChannels,
                        setNumChannels,
                        numChannelUpdates,
                        setNumChannelUpdates,
                        numFriends,
                        setNumFriends,
                        setError,
                    ]}
                />
                <div
                    className={`sidebarOverlay ${showSidebar ? "display" : ""}`}
                    onClick={closeSidebar}
                ></div>
            </div>
        </>
    );
}

export default Channels;
