const base64 = require("base-64");
require('dotenv').config();
const StatsD = require('node-statsd');
const statsdClient = new StatsD();

function decodeUserId(req) {
    const authHeader = req.headers['authorization'];
    const credentials = base64.decode(authHeader.split(' ')[1]);
    const [email, password] = credentials.split(':');
    return email;
}

const createAssignment = async (req, res, db) => {
    console.log("Creating assignment");
    statsdClient.increment('api_calls');
    try {

        if (Object.entries(req.body).length === 0 || Object.keys(req.body).length === 0 || JSON.stringify(req.body) === '{}') {
            return res.status(400).send({ message: 'Bad Request' });
        }

        const { name, points, num_of_attempts, deadline } = req.body
        console.log(name, points, num_of_attempts, deadline)
        if (!req.body.name) {
            return res.status(400).send({ message: "Assignment name is required" });
        }
        else if (points === undefined || points < 1 || points > 10) {
            return res.status(400).send({ message: "Points for assignment is required and must between 1 and 10" });
        }
        else if (num_of_attempts === undefined || num_of_attempts < 1 || num_of_attempts > 100) {
            return res.status(400).send({ message: "Number of attempts for assignment is required and should be less than 100" });
        }
        if (!req.body.deadline && new Date(req.body.deadline) <= new Date()) {
            return res.status(400).send({ message: "Deadline must be in the future" });
        }
        const email = decodeUserId(req);

        const user = await db.users.findOne({ where: { email } });

        if (!user) {
            return res.status(404).send('User not found');
        } else {
            const assignment = await db.assignments.create({
                id: Buffer.from(`${name}`, 'utf8').toString('base64'),
                userId: user.id,
                name,
                points,
                num_of_attempts,
                deadline
            });
            res.status(201).send(assignment)
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
    }
}

// const displayAllAssignments = async (req, res, db) => {
//     const email = decodeUserId(req);
//     const user = await db.users.findOne({ where: { email } });

//     await db.assignments.findAll({ where: { userId: user.id } })
//         .then((assignments) => {
//             if (assignments.length > 0) {
//                 res.status(200).json({
//                     status: "ok",
//                     data: assignments
//                 })
//             } else {
//                 res.status(204).json({
//                     status: "No content",
//                     message: "No Assignments to show"
//                 })
//             }
//         })
//         .catch((err) => {
//             res.status(500).json({
//                 status: "Error",
//                 error: err
//             })
//         })
// }

const displayAllAssignments = async (req, res, db) => {
    console.log("Display All Assignments");
    statsdClient.increment('api_calls');
    try {
        let assignments = await db.assignments.findAll({});
        res.status(200).send(assignments);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}


const getAssignment = async (req, res, db) => {
    console.log("Display particular assignment");
    statsdClient.increment('api_calls');
    try {
        const assignment_id = req.params.id;
        if (!assignment_id) {
            return res.status(400).send({ message: "Assignmnet Id is needed" });
        }
        const userId = req.user.id;

        let assignment = await db.assignments.findOne({ where: { id: assignment_id } })
        if (!assignment) { return res.status(404).send({ message: 'Assignment not found' }); }
        if (assignment.userId === userId) {
            res.status(200).send(assignment);
        } else {
            res.status(403).send({ message: "Forbidden" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
}



const updateAssignment = async (req, res, db) => {
    console.log("Updating a particular assignment")
    statsdClient.increment('api_calls');
    try {
        if (Object.entries(req.body).length === 0 || Object.keys(req.body).length === 0 || JSON.stringify(req.body) === '{}') {
            return res.status(400).send({ message: 'Bad Request' });
        }

        const { name, points, num_of_attempts, deadline } = req.body;
        const assignment_id = req.params.id;

        const userId = req.user.id;
        let assignment = await db.assignments.findOne({ where: { id: assignment_id } });
        if (!assignment) { return res.status(404).send({ message: 'Assignment not found' }); }
        if (assignment.userId === userId) {
            if (!req.body.name) {
                return res.status(400).send({ message: "Assignment name is required" });
            }
            else if (points === undefined || points < 1 || points > 10) {
                return res.status(400).send({ message: "Points for assignment is required and must between 1 and 10" });
            }
            else if (num_of_attempts === undefined || num_of_attempts < 1 || num_of_attempts > 100) {
                return res.status(400).send({ message: "Number of attempts for assignment is required and should be less than 100" });
            }
            if (!req.body.deadline && new Date(req.body.deadline) <= new Date()) {
                return res.status(400).send({ message: "Deadline must be in the future" });
            }
            await db.assignments.update({
                name,
                points,
                num_of_attempts,
                deadline
            }, {
                where: {
                    id: assignment_id,
                    userId: userId
                }
            })
                .then((assignments) => {
                    if (assignments.length > 0) {
                        res.status(200).send({ message: 'Assignment updated successfully' });
                    } else {
                        return res.status(404).send({ message: 'Assignment not found' });
                    }
                })
                .catch((error) => {
                    res.status(500).json({
                        Status: "Error",
                        error
                    })
                })
        } else {
            return res.status(403).send({ 'message': 'Unauthorized User' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }

}

const deleteAssignment = async (req, res, db) => {
    console.log("Deleting a particular assignment");
    statsdClient.increment('api_calls');
    try {
        let id = req.params.id;

        const userId = req.user.id;

        let assignment = await db.assignments.findOne({ where: { id: id } });
        if (!assignment) { return res.status(404).send({ message: 'Assignment not found' }); }
        if (assignment.userId === userId) {
            const result = await db.assignments.destroy({
                where: {
                    id: req.params.id
                }
            });

            if (result === 0) {
                res.status(404).send("Not Found")
            } else {
                res.status(204).send({ message: 'Assignment is deleted' });
            }
        } else {
            return res.status(403).send({ 'message': 'Unauthorized User' });
        }



    } catch (error) {
        console.error('Error deleting assignment:', error);
        res.status(500).send('Internal Server Error');
    }
}


module.exports = {
    createAssignment,
    displayAllAssignments,
    getAssignment,
    updateAssignment,
    deleteAssignment
};

