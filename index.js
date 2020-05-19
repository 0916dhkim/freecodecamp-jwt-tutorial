require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { verify } = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");
const { fakeDb } = require("./fakeDb");
const { isAuth } = require("./isAuth");
const {
    createAccessToken,
    createRefreshToken,
    sendAccessToken,
    sendRefreshToken
} = require("./tokens");

const server = express();
server.use(cookieParser());
server.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.post("/register", async function (req, res) {
    const { email, password } = req.body;
    try {
        // Hit database and fetch user.
        const user = fakeDb.find(user => user.email === email);
        if (user) {
            throw new Error("User already exists.");
        }
        const hashedPassword = await hash(password, 10);
        // Create user inside db.
        fakeDb.push({
            id: fakeDb.length,
            email: email,
            password: hashedPassword
        });
        res.send({ message: "User created" });
    } catch (e) {
        res.send({
            error: e.message
        });
    }
});

server.post("/login", async function (req, res) {
    const { email, password } = req.body;
    try {
        const user = fakeDb.find(user => user.email === email);

        // Check credentials.
        if (!user) {
            throw new Error("User does not exist.");
        }
        const valid = await compare(password, user.password);
        if (!valid) {
            throw new Error("Password mismatch.");
        }

        // Issue tokens.
        const accessToken = createAccessToken(user.id);
        const refreshToken = createRefreshToken(user.id);

        // Save refresh token in database.
        user.refreshToken = refreshToken;

        // Send response.
        sendRefreshToken(res, req, refreshToken);
        sendAccessToken(res, req, accessToken);
    } catch (e) {
        res.send({
            error: e.message
        });
    }
});

server.post("/logout", async function (req, res) {
    res.clearCookie("refreshtoken", {
        path: "/refresh_token"
    });
    res.send({
        message: "Logged out."
    });
});

server.post("/protected", async function(req, res) {
    try {
        const userId = isAuth(req);
        if (userId !== null) {
            res.send({
                data: "Very secret information"
            });
        } else {
            throw new Error("Not authorized");
        }
    } catch (e) {
        res.send({
            error: e.message
        })
    }
});

server.post("/refresh_token", function(req, res) {
    const token = req.cookies.refreshtoken;
    try {
        if (!token) {
            throw new Error("No refresh token.");
        }
        const payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = fakeDb.find(user => user.id === payload.userId);
        if (!user) {
            throw new Error("User does not exist.");
        }
        if (user.refreshToken !== token) {
            throw new Error("Refresh token is different from db.");
        }
        const accessToken = createAccessToken(user.id);
        const refreshToken = createRefreshToken(user.id);
        user.refreshToken = refreshToken;
        sendRefreshToken(res, req, refreshToken);
        sendAccessToken(res, req, accessToken);
    } catch (e) {
        res.send({
            error: e.message
        });
    }
});


server.listen(process.env.PORT, function() {
    console.log(`Listening on ${process.env.PORT}`);
});