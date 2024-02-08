import { useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

function Redirect() {
    const [loggedIn, setLoggedIn] = useOutletContext();
    const navigate = useNavigate();

    // Not sure if this will work as intended
    useEffect(() => {
        if (loggedIn) {
            navigate("./message-client/channels");
        } else {
            navigate("./message-client/login");
        }
    }, []);

    return <div className="redirect"></div>;
}

export default Redirect;
