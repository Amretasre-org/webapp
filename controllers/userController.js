const jwt = require("jsonwebtoken");
require('dotenv').config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const getUsers = async (req, res, db) => {
    await db.users.findAll()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials.",
            });
        });
};

const loginUser = async (req, res, db) => {
    console.warn("Login");
    try {
        const email = req.params.email;
        const { password } = req.body;

        const user = await db.users.findOne({ where: { email } });

        console.log(user);

        if (!user) {
            return res.status(404).json({
                status: "Not Found",
                error: "User not found"
            });
        }

        const encodedPassword = Buffer.from(password).toString("base64");

        if (user.password !== encodedPassword) {
            return res.status(401).json({
                status: "Unauthorized",
                error: "Invalid credentials"
            });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY, {
            expiresIn: "600s",
        });

        res.status(200).json({
            status: "OK",
            token
        });
    } catch (error) {
        res.status(500).json({ 
            status: "Login failed",
            error 
        });
    }
};

const loginUserBase64 = async (req, res, db) => {
    try {
        const email = req.params.email;
        const { password } = req.body;

        const user = await db.users.findOne({ where: { email } });

        console.log(user);

        if (!user) {
            return res.status(404).json({
                status: "Not Found",
                error: "User not found"
            });
        }

        const encodedPassword = Buffer.from(password).toString("base64");

        if (user.password !== encodedPassword) {
            return res.status(401).json({
                status: "Unauthorized",
                error: "Invalid credentials"
            });
        }

        const token = Buffer.from(password).toString("base64");

        res.status(200).json({
            status: "OK",
            token
        });
    } catch (error) {
        res.status(500).json({ 
            status: "Login failed",
            error 
        });
    }
}

module.exports = {
    getUsers,
    loginUser
};