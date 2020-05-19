const { sign } = require("jsonwebtoken");

exports.createAccessToken = userId => sign(
    { userId },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: "15m"
    }
)

exports.createRefreshToken = userId => sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: "7d"
    }
)

exports.sendAccessToken = (res, req, accessToken) => {
    res.send({
        accessToken,
        email: req.body.email
    });
}

exports.sendRefreshToken = (res, req, refreshToken) => {
    res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/refresh_token"
    });
}