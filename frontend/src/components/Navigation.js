import React from "react";
import { Link } from "@reach/router";

export function Navigation({ logoutCallback }) {
    return (
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/protected">Protected</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><button onClick={logoutCallback}>Log Out</button></li>
        </ul>
    );
}