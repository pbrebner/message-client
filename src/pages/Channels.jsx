import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";

import ChannelSidebar from "../components/ChannelSidebar";

import "./styles/Channels.css";

function Channels() {
    const [user, setUser] = useState("");
    //const [channels, setChannels] = useState("");
    const [numChannels, setNumChannels] = useState(0);

    // Used just to trigger component refresh
    const [updateChannel, setUpdateChannel] = useState(0);

    const [error, setError] = useState("");

    const navigate = useNavigate();

    //TODO: Confirm that the user is logged In, otherwise redirect to login

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

                if (response.status == "403") {
                    // Invalid Token
                    navigate("/message-client/login");
                } else if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                }

                const data = await response.json();
                console.log(data);

                setUser(data.user);
                //setChannels(data.user.channels);
                setNumChannels(data.user.channels.length);
                setError("");
            } catch (err) {
                setError(err.message);
                setUser("");
            }
        }
        getUser();
    }, []);

    return (
        <div className="channelsPage">
            <ChannelSidebar
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
                ]}
            />
        </div>
    );
}

export default Channels;
