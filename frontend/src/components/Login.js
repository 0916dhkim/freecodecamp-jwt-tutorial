import React, { useContext, useEffect, useState } from "react";
import { navigate } from "@reach/router";
import { UserContext } from "../App";

export function Login() {
    const [user, setUser] = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        const result = await (await fetch("http://localhost:4000/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        })).json();
        if (result.accessToken) {
            setUser({
                accesstoken: result.accessToken
            });
            navigate("/");
        } else {
            console.log(result.error);
        }
    }

    useEffect(() => {
        console.log(user);
    }, [user]);

    function handleChange(e) {
        if (e.currentTarget.name === "email") {
            setEmail(e.currentTarget.value);
        } else {
            setPassword(e.currentTarget.value);
        }
    }
    return (
        <div className="login-wrapper">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className="login-input">
                    <input
                        value={email}
                        onChange={handleChange}
                        type="text"
                        name="email"
                        placeholder="email"
                        autoComplete="email"
                    />
                    <input
                        value={password}
                        onChange={handleChange}
                        type="text"
                        name="password"
                        placeholder="password"
                        autoComplete="current-password"
                    />
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    );
}
