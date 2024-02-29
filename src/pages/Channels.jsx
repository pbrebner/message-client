import { useState, useEffect } from "react";
import { useNavigate, Outlet, useOutletContext } from "react-router-dom";

import ChannelSidebar from "../components/ChannelSidebar";
import PageLoader from "../components/PageLoader";

import "./styles/Channels.css";

function Channels() {
    const [user, setUser] = useState("");
    const [numChannels, setNumChannels] = useState(0);
    // Used just to trigger component refresh
    const [updateChannel, setUpdateChannel] = useState(0);

    const [pageLoading, setPageLoading] = useState(true);

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
                console.log(data);

                setTimeout(() => {
                    setPageLoading(false);
                }, "2000");

                if (response.status == "401") {
                    // Invalid Token
                    navigate("/message-client/login");
                } else if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                } else {
                    setUser(data.user);
                    setNumChannels(data.user.channels.length);
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

    return (
        <>
            {pageLoading && <PageLoader />}
            <div className="channelsPage">
                <ChannelSidebar
                    user={user}
                    numChannels={numChannels}
                    setNumChannels={setNumChannels}
                    updateChannel={updateChannel}
                />
                <div className="vl"></div>
                <Outlet
                    context={[
                        user,
                        numChannels,
                        setNumChannels,
                        updateChannel,
                        setUpdateChannel,
                        setError,
                    ]}
                />
            </div>
        </>
    );
}

export default Channels;
