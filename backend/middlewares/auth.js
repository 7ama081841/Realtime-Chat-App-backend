const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header("auth");

    if (!token) {
        return res.status(300).send("access rejeced");
    }

    try {
        const decodeToken = jwt.verify(token, process.env.TOKENKEY);

        req.user = decodeToken;

        next();
    } catch (err) {
        res.status(403).send("wrong token");
    }
};
