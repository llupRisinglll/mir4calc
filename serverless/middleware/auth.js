const jwt = require("jsonwebtoken");

// import Dotenv
require("dotenv").config();


const verifyToken = (req, res, next) => {

    // TODO: Check if the token is valid based on its existence in the database (ValidTokens)

    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
    } catch (err) {
        return res.send(err);
        return res.status(401).send("Invalid Token: "+process.env.JWT_SECRET +"..." + token );
    }
    return next();
};

module.exports = verifyToken;