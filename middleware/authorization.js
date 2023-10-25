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
            
            if (user && await bcrypt.compare(password, user.password)) {
                req.user = user;
                next();
            } else {
                res.status(401).json({
                    status: "Unauthorized",
                    message: "Login credentials does not match"
                });
            }
        } catch (error) {
            console.error('Error fetching user from the database:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(401).send('Unauthorized');
    }
};

module.exports = authorization;