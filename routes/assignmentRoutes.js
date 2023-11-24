const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");
const db = require("../models");

const authorization = require("../middleware/authorization");

router.post("/", authorization, (req, res) => { assignmentController.assignmentCreation(req, res, db) });

router.post("/:id/submission", authorization, (req, res) => assignmentController.submissionCreation(req, res, db));

router.get("/", authorization, (req, res) => assignmentController.getAllAssignments(req, res, db));

router.get("/:id", authorization, (req, res) => assignmentController.displayAssignment(req, res, db));

router.put("/:id", authorization, (req, res) => assignmentController.assignmentUpdate(req, res, db));

router.delete("/:id", authorization, (req, res) => assignmentController.assignmentDeletion(req, res, db));

router.patch("/", (req, res) => assignmentController.patchAssignmentCall(req, res));

router.patch("/:id", (req, res) => assignmentController.patchAssignmentCall(req, res));

module.exports = router;