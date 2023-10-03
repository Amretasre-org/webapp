const base64 = require('base-64');
const bcrypt = require('bcrypt');
const db = require('../models/index');

const authorization = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const Users = db.users;

    if (authHeader) {
        try {
            const credentials = base64.decode(authHeader.split(' ')[1]);
            const [email, password] = credentials.split(':');
            const user = await Users.findOne({ where: { email } });
            // if (user && Buffer.from(`${password}`, 'utf8').toString('base64') == user.password) {
            //     req.user = user;
            //     next();
            // } else {
            //     res.status(400).json({
            //         status: "Unauthorized",
            //         message: "Login credentials does not match"
            //     });
            // }
            if (user && await bcrypt.compare(password, user.password)) {
                req.user = user;
                next();
            } else {
                res.status(400).json({
                    status: "Unauthorized",
                    message: "Login credentials does not match"
                });
            }
        } catch (error) {
            console.error('Error fetching user from the database:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(400).json({
            status: "Bad request",
            message: "Login credentials missing"
        });
    }
};

module.exports = authorization;