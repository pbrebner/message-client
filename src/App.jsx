import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import "./App.css";

function App() {
    let [loggedIn, setLoggedIn] = useState(false);

    // Need to redirect to appropriate page depending if user is logged in
    // Initially checks if logged in when page is refreshed
    useEffect(() => {
        setLoggedIn(localStorage.getItem("userAuth") || false);
    }, []);

    return (
        <div className="app">
            <Outlet context={[loggedIn, setLoggedIn]} />
        </div>
    );
}

export default App;
