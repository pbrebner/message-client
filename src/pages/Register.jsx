import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

import Button from "../components/Button";
import "./styles/RegisterPages.css";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [showLoader, setShowLoader] = useState(false);
    const [formError, setFormError] = useState("");
    const [loggedIn, setLoggedIn, setError] = useOutletContext();

    const navigate = useNavigate();

    async function handleRegister(e) {
        e.preventDefault();
        setShowLoader(true);

        setFormError("");
        setError("");

        const formData = JSON.stringify({
            name: name,
            email: email,
            password: password,
            passwordConfirm: passwordConfirm,
        });

        try {
            const response = await fetch(
                "https://message-api.fly.dev/api/users",
                {
                    method: "post",
                    body: formData,
                    headers: { "content-Type": "application/json" },
                }
            );

            const result = await response.json();
            //console.log(result);

            setShowLoader(false);

            if (response.status == 400) {
                setFormError(result.errors);
            } else if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            } else {
                navigate("/message-client/login");
            }
        } catch (err) {
            setError(err.message);
            setShowLoader(false);
        }
    }

    function handleFocus(e) {
        e.target.nextElementSibling.classList.add("display");
    }

    function handleBlur(e) {
        e.target.nextElementSibling.classList.remove("display");
    }

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
                            autoComplete="off"
                        />
                    </div>
                    <div className="formElement">
                        <label htmlFor="name">Display Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            autoComplete="off"
                        />
                        <p className="inputGuide">
                            This is how others will see you.
                        </p>
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
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                        <p className="inputGuide">
                            Password must be minimum 6 characters.
                        </p>
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
                        <Button
                            styleRef={"registerBtn"}
                            text="Continue"
                            onClick={handleRegister}
                            loading={showLoader}
                            disabled={showLoader}
                        />
                    </div>
                    {formError && (
                        <div className="registerErrorContainer">
                            <ul className="registerErrorList">
                                {formError.map((error, index) => (
                                    <li key={index} className="registerError">
                                        {error.msg}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
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
