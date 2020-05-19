import React, { useContext } from "react";
import { Redirect } from "@reach/router";
import { UserContext } from "../App";

export function Content() {
    const [user] = useContext(UserContext);
    if (!user.accesstoken) {
        return <Redirect from="" to="login" noThrow />
    }
    return (
        <div>
            Content!
        </div>
    );
}