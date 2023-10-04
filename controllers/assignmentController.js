const base64 = require("base-64");
require('dotenv').config();

function decodeUserId(req) {
    const authHeader = req.headers['authorization'];
    const credentials = base64.decode(authHeader.split(' ')[1]);
    const [email, password] = credentials.split(':');
    return email;
}

const createAssignment = async (req, res, db) => {
    if (!req.body.name) {
        res.status(400).json({
            status: "Bad Request",
            message: "Assignment name required"
        })
    } else if (!req.body.points && req.body.points <= 10 && req.body.points >= 1) {
        res.status(400).json({
            status: "Bad Request",
            message: "Points for assignment is required and must be between 1 and 10"
        })
    } else if (!req.body.num_of_attempts && req.body.num_of_attempts <= 3 && req.body.num_of_attempts >= 1) {
        res.status(400).json({
            status: "Bad Request",
            message: "Number of attempts for assignment is required and should be less than 3"
        })
    } else if (!req.body.deadline) {
        res.status(400).json({
            status: "Bad Request",
            message: "Deadline of assignment is required"
        })
    }

    try {
        const email = decodeUserId(req);

        const user = await db.users.findOne({ where: { email } });
        const { name, points, num_of_attempts, deadline } = req.body
        await db.assignments.create({
            id: Buffer.from(`${name}`, 'utf8').toString('base64'),
            userId: user.id,
            name,
            points,
            num_of_attempts,
            deadline
        });
        res.status(200).json({
            status: "OK",
            message: `Assignment added successfully to ${user.id}`
        })
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
            error: e
        })
    }
}

const displayAllAssignments = async (req, res, db) => {
    const email = decodeUserId(req);
    const user = await db.users.findOne({ where: { email } });

    await db.assignments.findAll({ where: { userId: user.id } })
        .then((assignments) => {
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
}


const getAssignment = async (req, res, db) => {

    const assignment_id = req.params.id;
    await db.assignments.findOne({ where: { id: assignment_id } })
        .then((assignment) => {
            if (!assignment) {
                res.status(204).json({
                    status: "No content",
                    message: "No assignment to show"
                })
            } else {
                res.status(200).json({
                    status: "ok",
                    data: assignment
                })
            }
        })
        .catch((err) => {
            res.status(500).json({
                status: "Error",
                error: err
            })
        })
}


const updateAssignment = async (req, res, db) => {
    const { name, points, num_of_attempts, deadline } = req.body;
    if (!req.body.name) {
        return res.status(400).json({
            status: "Bad Request",
            message: "Assignment name required"
        })
    } else if (!req.body.points && req.body.points <= 10 && req.body.points >= 1) {
        return res.status(400).json({
            status: "Bad Request",
            message: "Points for assignment is required and must be between 1 and 10"
        })
    } else if (!req.body.num_of_attempts && req.body.num_of_attempts <= 3 && req.body.num_of_attempts  >= 1) {
        return res.status(400).json({
            status: "Bad Request",
            message: "Number of attempts for assignment is required and must be between 1 and 3"
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
}

const deleteAssignment = async (req, res, db) => {
    try {
        const result = await db.assignments.destroy({
            where: {
                id: req.params.id
            }
        });

        if (result === 0) {
            res.status(404).json({
                status: "Not Found",
                message: "Assignment not found"
            });
        } else {
            res.status(204).json({
                status: "No content",
                message: "Assignment deleted successfully"
            }) 
        }
    } catch (error) {
        console.error('Error deleting assignment:', error);
        res.status(500).json({
            status: "Error",
            error
        });
    }
}


module.exports = {
    createAssignment,
    displayAllAssignments,
    getAssignment,
    updateAssignment,
    deleteAssignment
};

