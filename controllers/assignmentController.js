const jwt = require("jsonwebtoken");
require('dotenv').config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(400).json({
            status: "Bad request",
            message: 'Token not provided'
        });
    }

    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                status: "Forbidden",
                message: 'Invalid token'
            });
        }

        req.userId = decoded.userId;
        next();
    });
}

function verifyBase64Token(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(400).json({
            status: "Bad request",
            message: 'Token not provided'
        });
    }

    
}

const createAssignment = async (req, res, db) => {
    console.log(req.headers);
    verifyToken(req, res, async () => {
        if (!req.body.name) {
            res.status(400).json({
                status: "Bad Request",
                message: "Assignment name required"
            })
        } else if (!req.body.points && req.body.points <= 10) {
            res.status(400).json({
                status: "Bad Request",
                message: "Points for assignment is required"
            })
        } else if (!req.body.num_of_attempts && req.body.num_of_attempts <= 3) {
            res.status(400).json({
                status: "Bad Request",
                message: "Number of attempts for assignment is required"
            })
        } else if (!req.body.deadline) {
            res.status(400).json({
                status: "Bad Request",
                message: "Deadline of assignment is required"
            })
        }

        try {
            const { name, points, num_of_attempts, deadline } = req.body
            await db.assignments.create({
                id: Buffer.from(`${name}`, 'utf8').toString('base64'),
                userId: req.userId,
                name,
                points,
                num_of_attempts,
                deadline
            });
            res.status(200).json({
                status: "OK",
                message: `Assignment added successfully to ${req.userId}`
            })
        } catch (e) {
            console.error(e);
            res.status(500).json({
                error: e
            })

        }
    });
}


const displayAllAssignments = async (req, res, db) => {
    verifyToken(req, res, async () => {
        await db.assignments.findAll({ where: { userId: req.userId } })
            .then((assignments) => {
                // console.log(assignments.length);
                // res.status(200).json({
                //     status: "ok",
                //     data: assignments
                // })
                if (assignments.length > 0) {
                    res.status(200).json({
                        status: "ok",
                        data: assignments
                    })
                } else {
                    res.status(204).json({
                        status: "No content",
                        message: "No Assignments to show"
                    })
                }
            })
            .catch((err) => {
                res.status(500).json({
                    status: "Error",
                    error: err
                })
            })
    });
}

// To fix
const getAssignment = async (req, res, db) => {

    verifyToken(req, res, async () => {
        const assignment_id = req.params.id;
        console.log(assignment_id);

        await db.assignments.findOne({ where: { id: assignment_id } })
            .then((assignments) => {
                console.log(assignments.length)
                if (assignments.length > 0) {
                    res.status(200).json({
                        status: "ok",
                        data: assignments
                    })
                } else {
                    res.status(204).json({
                        status: "No content",
                        message: "No Assignments to show"
                    })
                }
            })
            .catch((err) => {
                res.status(500).json({
                    status: "Error",
                    error: err
                })
            })
    });
}


const updateAssignment = async (req, res, db) => {
    const { name, points, num_of_attempts, deadline} = req.body;
    verifyToken(req, res, async () => {
        if (!req.body.name) {
            return res.status(400).json({
                status: "Bad Request",
                message: "Assignment name required"
            })
        } else if (!req.body.points && req.body.points <= 10) {
            return res.status(400).json({
                status: "Bad Request",
                message: "Points for assignment is required"
            })
        } else if (!req.body.num_of_attempts && req.body.num_of_attempts <= 3) {
            return res.status(400).json({
                status: "Bad Request",
                message: "Number of attempts for assignment is required"
            })
        } else if (!req.body.deadline) {
            return res.status(400).json({
                status: "Bad Request",
                message: "Deadline of assignment is required"
            })
        }
        await db.assignments.update({
            name,
            points,
            num_of_attempts,
            deadline
        }, {
            where: {
                id: req.params.id
            }
        })
            .then((assignments) => {
                if (assignments.length > 0) {
                    res.status(200).json({
                        status: "ok",
                        message: "Assignmnet Updated successfully"
                    })
                } else {
                    res.status(204).json({
                        status: "No content",
                        message: "No Assignments to Update"
                    })
                }
            })
            .catch((error) => {
                res.status(500).json({
                    Status: "Error",
                    error
                })
            })
    })
}

const deleteAssignment = async (req, res, db) => {
    verifyToken(req, res, () => {
        db.assignments.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(() => {
            res.status(200).json({
                status:"Ok",
                message: "Deleted assignment successfully"
            })
        })
        .catch((error) => {
            res.status(500).json({
                status: "Error",
                error
            })
        })
    })
}

module.exports = {
    createAssignment,
    displayAllAssignments,
    getAssignment,
    updateAssignment,
    deleteAssignment
};

