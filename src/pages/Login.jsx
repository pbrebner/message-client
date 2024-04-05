import { useState } from "react";
import {
    Link,
    useNavigate,
    useOutletContext,
    useLocation,
} from "react-router-dom";

import Button from "../components/Button";
import "./styles/RegisterPages.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showLoader, setShowLoader] = useState(false);
    const [formError, setFormError] = useState("");

    const [loggedIn, setLoggedIn, setError] = useOutletContext();
    const navigate = useNavigate();
    let location = useLocation();

    // Logs in user with the provided credentials
    function handleLogin(e) {
        e.preventDefault();
        const formData = JSON.stringify({
            email: email,
            password: password,
        });
        login(formData);
    }

    // Logs in user with the pre-set credentials
    function handleGuestLogin(e) {
        e.preventDefault();
        const formData = JSON.stringify({
            email: "sarawilson@example.com",
            password: "userPassword",
        });
        login(formData);
    }

    async function login(formData) {
        setShowLoader(true);

        setFormError("");
        setError("");

        try {
            const response = await fetch(
                "https://message-api.fly.dev/api/login",
                {
                    method: "post",
                    body: formData,
                    headers: { "content-Type": "application/json" },
                }
            );

            const result = await response.json();
            //console.log(result);

            setShowLoader(false);

            // Handle result
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
            setError(err.message);
            setShowLoader(false);
        }
    }

    return (
        <div className="login">
            <div className="loginContainer">
                {location.state && (
                    <div className="locationMessage">
                        {location.state.message}
                    </div>
                )}
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
                    <div className="formElement">
                        <Button
                            styleRef={"registerBtn"}
                            text="Guest Login"
                            onClick={handleGuestLogin}
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
