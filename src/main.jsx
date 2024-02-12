import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import Redirect from "./components/Redirect.jsx";
import Channels from "./pages/Channels.jsx";
import FriendsSection from "./components/FriendsSection.jsx";
import Channel from "./pages/Channel.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Account from "./pages/Account.jsx";

import "./index.css";

// TODO: Fix the channel Routes and add Outlet to Children
const router = createBrowserRouter([
    {
        path: "/message-client",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <Redirect /> },
            {
                path: "channels",
                element: <Channels />,
                children: [
                    { index: true, element: <FriendsSection /> },
                    { path: ":channelId", element: <Channel /> },
                ],
            },
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "account",
                element: <Account />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
