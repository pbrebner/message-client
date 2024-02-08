import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./styles/RegisterPages.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

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
                        <button className="registerBtn">Continue</button>
                    </div>
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
