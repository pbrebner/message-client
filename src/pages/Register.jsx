import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./styles/RegisterPages.css";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const navigate = useNavigate();

    // TODO: add info below inputs on focus to help the user
    return (
        <div className="register">
            <div className="registerContainer">
                <h2 className="title">Register</h2>
                <form className="registerForm">
                    <div className="formElement">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="formElement">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            placeholder="Confirm your password"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                        />
                    </div>
                    <div className="formElement">
                        <button className="registerBtn">Continue</button>
                    </div>
                </form>
                <p className="formAltText">
                    Already have an account?{" "}
                    <Link to="../login" className="registerLink">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
