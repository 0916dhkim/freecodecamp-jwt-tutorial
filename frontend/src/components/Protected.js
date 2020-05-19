import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../App";

export function Protected() {
    const [user] = useContext(UserContext);
    const [content, setContent] = useState("You need to log in!");

    useEffect(() => {
        async function fetchProtected() {
            const result = await (await fetch("http://localhost:4000/protected", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.accesstoken}`
                }
            })).json();
            if (result.data) {
                setContent(result.data);
            }
        }
        fetchProtected();
    }, [user]);

    return <div>{content}</div>;
}