import { useState, useEffect } from "react";
import { useNavigate, Outlet, useOutletContext } from "react-router-dom";

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

                setTimeout(() => {
                    setPageLoading(false);
                }, "2000");

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
                    setUser(data.user);
                    setNumChannels(data.user.channels.length);
                    setNumFriends(data.user.friends.length);
                    setError("");
                }
            } catch (err) {
                setError(err.message);
                setUser("");

                setTimeout(() => {
                    setPageLoading(false);
                }, "2000");
            }
        }
        getUser();
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
