import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Redirect() {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("userAuth")) {
            navigate("./message-client/channels");
        } else {
            navigate("./message-client/login");
        }
    }, []);

    return <div className="redirect"></div>;
}

export default Redirect;
