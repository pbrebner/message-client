import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import io from "socket.io-client";

import AppError from "./components/AppError";
import "./App.css";

const socket = io.connect("http://localhost:3000");

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [error, setError] = useState("");

    // Need to redirect to appropriate page depending if user is logged in
    // Initially checks if logged in when page is refreshed
    useEffect(() => {
        setLoggedIn(localStorage.getItem("userAuth") || false);
    }, []);

    return (
        <div className="app">
            <Outlet context={[loggedIn, setLoggedIn, setError, socket]} />
            {error && <AppError error={error} />}
        </div>
    );
}

export default App;
