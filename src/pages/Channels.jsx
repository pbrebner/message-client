import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";

// TODO: Create a channels header (either in this compnent or make new header component)
import ChannelSidebar from "../components/ChannelSidebar";
import Friends from "../components/Friends";

import "./styles/Channels.css";

function Channels() {
    const [user, setUser] = useState("");

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
            <ChannelSidebar />
            <div className="vl"></div>
            <Outlet />
        </div>
    );
}

export default Channels;
