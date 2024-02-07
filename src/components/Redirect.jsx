import { useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

function Redirect() {
    const [loggedIn, setLoggedIn] = useOutletContext();
    const navigate = useNavigate();

    // This isn't going to quite do what I want
    useEffect(() => {
        if (loggedIn) {
            navigate("../channels");
        } else {
            navigate("../login");
        }
    });

    return <div className="redirect"></div>;
}

export default Redirect;
