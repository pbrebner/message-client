import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

import Button from "../components/Button";
import "./styles/RegisterPages.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showLoader, setShowLoader] = useState(false);

    const [formError, setFormError] = useState("");
    const [error, setError] = useState("");

    const [loggedIn, setLoggedIn] = useOutletContext();
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        setShowLoader(true);

        setFormError("");
        setError("");

        const formData = JSON.stringify({
            email: email,
            password: password,
        });

        try {
            const response = await fetch(
                "https://message-api.fly.dev/api/login",
                {
                    method: "post",
                    body: formData,
                    headers: { "content-Type": "application/json" },
                }
            );

            console.log(response);
            const result = await response.json();
            console.log(result);

            setShowLoader(false);

            if (response.status == 400) {
                setFormError(result.errors);
            } else if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            } else if (result.token) {
                // Save token to local storage and setLoggedIn
                localStorage.setItem("token", result.token);
                localStorage.setItem("userAuth", true);
                localStorage.setItem("name", result.body.name);
                localStorage.setItem("userId", result.body._id);

                setLoggedIn(true);
                navigate("/message-client/channels");
            }
        } catch (err) {
            // TODO: Add general errors to page
            setError(err.message);
        }
    }

    return (
        <div className="login">
            <div className="loginContainer">
                <h2 className="title">Login</h2>
                <form className="loginForm">
                    <div className="formElement">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="off"
                        />
                    </div>
                    <div className="formElement">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="formElement">
                        <Button
                            styleRef={"registerBtn"}
                            text="Continue"
                            onClick={handleLogin}
                            loading={showLoader}
                            disabled={showLoader}
                        />
                    </div>
                    {formError && (
                        <div className="loginErrorContainer">
                            <ul className="loginErrorList">
                                <li className="loginError">{formError}</li>
                            </ul>
                        </div>
                    )}
                </form>
                <p className="formAltText">
                    Need an account?{" "}
                    <Link to="../register" className="registerLink">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
