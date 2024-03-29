// const base64 = require("base-64");
require('dotenv').config();
const utils = require("../utils/bcrypting");

// const sns = new AWS.SNS();
const topicArn = process.env.TOPICARN;

const StatsD = require('node-statsd');
const statsdClient = new StatsD(({
    host: 'localhost',
    port: 8125,
}));

const log4js = require('../log4js-config');
const logger = log4js.getLogger();

const assignmentCreation = async (req, res, db) => {
    try {
        console.log("Creating assignment");
        statsdClient.increment('post.assignment.create');
        logger.info('Creating assignment api call');
        if (Object.entries(req.body).length === 0 || Object.keys(req.body).length === 0 || JSON.stringify(req.body) === '{}') {
            logger.error('Bad Request in create assignment');
            return res.status(400).send({ message: 'Bad Request' });
        }

        const { name, points, num_of_attempts, deadline } = req.body
        if (!name) {
            logger.error('Bad Request in creating assignment due to missing name');
            logger.error(req.body);
            return res.status(400).send({ message: "Assignment name is required" });
        }
        else if (points === undefined || points < 1 || points > 10) {
            logger.error('Bad Request in creating assignment due to points');
            logger.error(req.body);
            return res.status(400).send({ message: "Points for assignment is required and must between 1 and 10" });
        }
        else if (num_of_attempts === undefined || num_of_attempts < 1 || num_of_attempts > 100) {
            logger.error('Bad Request in creating assignment due to num_of_attempts');
            logger.error(req.body);
            return res.status(400).send({ message: "Number of attempts for assignment is required and should be less than 100" });
        }
        if (!deadline && new Date(deadline) <= new Date()) {
            logger.error('Bad Request in creating assignment due to deadline');
            logger.error(req.body);
            return res.status(400).send({ message: "Deadline must be in the future" });
        }
        const email = utils.decodeUserEmail(req);

        const user = await db.accounts.findOne({ where: { email } });

        if (!user) {
            logger.error('User not found when creating assignment');
            return res.status(404).send('User not found');
        } else {
            const assignment = await db.assignments.create({
                userId: user.id,
                name,
                points,
                num_of_attempts,
                deadline
            });
            logger.info('Assignment created successfully');
            res.status(201).send(assignment)
        }
    }
    catch (e) {
        console.error(e);
        logger.error('Error create assignment');
        logger.error(e)
        res.status(500).send("Internal Server Error");
    }
}

// const getAllAssignments = async (req, res, db) => {
//     const email = utils.decodeUserEmail(req);
//     const user = await db.accounts.findOne({ where: { email } });

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

const getAllAssignments = async (req, res, db) => {
    try {
        console.log("Display All Assignments");
        statsdClient.increment('get.assignment.displayAll');
        logger.info('Display All Assignments api call');
        let assignments = await db.assignments.findAll({});
        console.log(assignments.length, "Total number of Assignments");
        if (assignments.length > 0) {
            console.log("Successful get all api call")
            logger.info('Successful get all api call');
            res.status(200).send(assignments);
        } else {
            console.log("Successful get all api call, but no assignments")
            logger.info('Successful get all api call, but no assignments');
            return res.status(204).send();
        }

    } catch (error) {
        console.error(error);
        logger.error('Error get all assignments');
        logger.error(err)
        res.status(500).send('Internal Server Error');
    }
}

const displayAssignment = async (req, res, db) => {
    try {
        console.log("Display particular assignment");
        statsdClient.increment('get.assignment.display');
        logger.info('Display particular Assignment method call');
        const assignment_id = req.params.id;
        if (!assignment_id) {
            logger.error('Invalid assignment id, Bad request in get assignment');
            return res.status(400).send({ message: "Assignment Id is needed" });
        }
        const userId = req.user.id;

        let assignment = await db.assignments.findOne({ where: { id: assignment_id } })
        if (!assignment) {
            logger.error('Assignment not found, Bad request in get assignment');
            return res.status(404).send({ message: 'Assignment not found' });
        }
        if (assignment.userId === userId) {
            logger.info("Successful get all assignments");
            res.status(200).send(assignment);
        } else {
            logger.error('Forbidden user in get an assignment method call');
            res.status(403).send({ message: "Forbidden" });
        }
    } catch (err) {
        console.error(err);
        logger.error('Error get an assignment method call');
        logger.error(err)
        res.status(500).send({ message: "Internal Server Error" });
    }
}

const assignmentUpdate = async (req, res, db) => {
    console.log("Updating a particular assignment")
    statsdClient.increment('put.assignment.update');
    try {
        logger.info('Updating a particular assignment call');
        if (Object.entries(req.body).length === 0 || Object.keys(req.body).length === 0 || JSON.stringify(req.body) === '{}') {
            return res.status(400).send({ message: 'Bad Request' });
        }

        const { name, points, num_of_attempts, deadline } = req.body;
        const assignment_id = req.params.id;

        const userId = req.user.id;
        let assignment = await db.assignments.findOne({ where: { id: assignment_id } });
        if (!assignment) {
            logger.error('Assignment not found, Update assignment method call');
            return res.status(404).send({ message: 'Assignment not found' });
        }
        if (assignment.userId === userId) {
            if (!name) {
                logger.error('Bad Request in updating assignment due to assignment name');
                logger.error(req.body);
                return res.status(400).send({ message: "Assignment name is required" });
            }
            else if (points === undefined || points < 1 || points > 10) {
                logger.error('Bad Request in updating assignment due to points');
                logger.error(req.body);
                return res.status(400).send({ message: "Points for assignment is required and must between 1 and 10" });
            }
            else if (num_of_attempts === undefined || num_of_attempts < 1 || num_of_attempts > 100) {
                logger.error('Bad Request in updating assignment due to num_of_attempts');
                logger.error(req.body);
                return res.status(400).send({ message: "Number of attempts for assignment is required and should be less than 100" });
            }
            if (!deadline && deadline <= new Date()) {
                logger.error('Bad Request in updating assignment due to deadline');
                logger.error(req.body);
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
                        logger.info("Assignment updated successfully")
                        res.status(204).send({ message: 'Assignment updated successfully' });
                    } else {
                        logger.error("Assignment not found, in Update assignment method call");
                        return res.status(404).send({ message: 'Assignment not found' });
                    }
                })
                .catch((error) => {
                    logger.error("Error, in Update assignment method call");
                    logger.error(error);
                    console.error("Error, in Update assignment method call");
                    console.error(error);
                    res.status(500).json({
                        Status: "Error",
                        error
                    })
                })
        } else {
            logger.error("Unauthorized user, in Update assignment method call");
            return res.status(403).send({ 'message': 'Unauthorized User' });
        }
    } catch (err) {
        console.error(err);
        logger.error('Error update assignment');
        logger.error(err)
        res.status(500).send('Internal Server Error');
    }

}

const assignmentDeletion = async (req, res, db) => {
    try {
        console.log("Deleting a particular assignment");
        statsdClient.increment('delete.assignment.delete');
        logger.info('Deleting a specific assignment method call');
        let id = req.params.id;
        const userId = req.user.id;

        if (Object.keys(req.body).length > 0) {
            logger.error('No request body needed for delete');
            return res.status(400).send({ message: "No body needed for deletion" });
        } else {
            let assignment = await db.assignments.findOne({ where: { id: id } });
            if (!assignment) {
                logger.error('Assignment not found, delete assignment call');
                return res.status(404).send({ message: 'Assignment not found' });
            }
            if (assignment.userId === userId) {
                let submissionCount = await db.submissions.count({
                    where: {
                        assignment_id:assignment.id,
                    }
                });

                console.log("Submissions count: ", submissionCount);
                if (submissionCount > 0) {
                    console.error("Submission exists, cannot delete assignment");
                    logger.error("Submission exists, cannot delete assignment");
                    return res.status(400).send({ message: "Cannot delete assignment with submissions" });
                } else {
                    const result = await db.assignments.destroy({
                        where: {
                            id: req.params.id
                        }
                    });

                    if (result === 0) {
                        logger.error('Assignment not found for the user, delete assignment call');
                        res.status(404).send("Not Found")
                    } else {
                        logger.info(`${req.params.id} Assignment deleted successully`);
                        res.status(204).send({ message: 'Assignment is deleted' });
                    }
                }

            } else {
                logger.error('Assignment not found for the user, delete assignment call');
                return res.status(403).send({ 'message': 'Unauthorized User' });
            }
        }
    } catch (error) {
        console.error('Error deleting assignment:', error);
        logger.error('Error deleting assignment');
        logger.error(error)
        res.status(500).send('Internal Server Error');
    }
}

const patchAssignmentCall = (req, res) => {
    logger.info("Patch method is not allowed for assignment");
    console.log("Patch method is not allowed for assignment");
    statsdClient.increment('put.assignment.patch');
    return res.status(405).json({
        message: "Patch Method Not Allowed For Assignment"
    })
}

const submissionCreation = async (req, res, db) => {
    try {
        statsdClient.increment('post.assignment.submission');
        logger.info('Creating assignment api call');
        console.log("Submission create API");

        const assignment_id = req.params.id;

        if (Object.entries(req.body).length === 0 || Object.keys(req.body).length === 0 || JSON.stringify(req.body) === '{}') {
            logger.error('Bad Request in create assignment');
            console.log('Bad Request in create assignment')
            return res.status(400).send({ message: 'Bad Request' });
        }

        const { submission_url } = req.body;

        if (!utils.containsURL(submission_url)) {
            logger.error("Submission request should contain a URL");
            console.error("Submission request should contain a URL");
            return res.status(400).send({ message: 'Request should contain URL' });
        } else if (!utils.isZipFile(submission_url)) {
            logger.error("URL should point to a ZIP file");
            console.error("URL should point to a ZIP file");
            return res.status(400).send({ message: 'URL should point to a ZIP file' });
        } else {
            const email = utils.decodeUserEmail(req);

            const user = await db.accounts.findOne({ where: { email } });

            if (!user) {
                logger.error('User not found when creating assignment');
                return res.status(404).send('User not found');
            } else {
                const userId = req.user.id;
                let assignment = await db.assignments.findOne({ where: { id: assignment_id } })
                if (!assignment) {
                    logger.error('Assignment not found, Bad request in get assignment');
                    return res.status(404).send({ message: 'Assignment not found' });
                }

                const currentDate = new Date();

                let submissionCount = await db.submissions.count({
                    where: {
                        assignment_id,
                    }
                });

                console.log(submissionCount, "Number of submissions done by user");
               
                if (assignment.deadline >= currentDate && submissionCount < assignment.num_of_attempts) {
                    const submission_created = await db.submissions.create({
                        assignment_id: assignment_id,
                        user_id: userId,
                        submission_url: submission_url,
                    });
                    console.log(submission_created.id);

                    const params = {
                        Message: JSON.stringify({
                            //   messageType: 'Submission Added',
                            submissionId: submission_created.id,
                            submissionUrl: submission_url,
                            assignmentId: assignment_id,
                            assignmentName: assignment.name,
                            userEmail: email,
                        }),
                        TopicArn: topicArn,
                    };

                    console.log("Publish Params: ", params);
                    logger.info("Publish Params: ", params);

                    const sns = await utils.publishToSNS(params);
                    logger.info(`Submission ${submission_created.id} created successfully and published in SNS`);
                    console.log(`Submission ${submission_created.id} created successfully and published in SNS`)
                    res.status(201).send(submission_created)
                } else if (assignment.deadline < currentDate) {
                    logger.error("Submission cannot be done after the deadline");
                    console.error("Submission cannot be done after the deadline")
                    return res.status(400).json({
                        message: "Deadline has passed",
                    })
                } else if (submissionCount >= assignment.num_of_attempts) {
                    logger.error("Number of attempts for submission has exceeded");
                    console.error("Number of attempts for submission has exceeded")
                    return res.status(400).json({
                        message: "Number of attempts for submission has exceeded",
                    })
                }
                else {
                    logger.error("Error in submission");
                    console.error("Error in submission")
                    return res.status(500).send("Internal Server Error");
                }


            }
        }

    } catch (error) {
        logger.error('Error creating submission');
        console.error('Error creating submission');
        logger.error(error);
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}




module.exports = {
    assignmentCreation,
    getAllAssignments,
    displayAssignment,
    assignmentUpdate,
    assignmentDeletion,
    patchAssignmentCall,
    submissionCreation
};

