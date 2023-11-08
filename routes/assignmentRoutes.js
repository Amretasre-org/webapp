const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");
const db = require("../models");

const authorization = require("../middleware/authorization");

router.post("/", authorization, (req, res) => {
    assignmentController.createAssignment(req, res, db);
});

router.get("/", authorization, (req, res) => assignmentController.displayAllAssignments(req, res, db));

router.get("/:id", authorization, (req, res) => assignmentController.getAssignment(req, res, db));

router.put("/:id", authorization, (req, res) => assignmentController.updateAssignment(req, res, db));

router.delete("/:id", authorization, (req, res) => assignmentController.deleteAssignment(req, res, db));

router.patch("/", (req, res) => assignmentController.patchAssignmentCall(req, res));

router.patch("/:id", (req, res) => assignmentController.patchAssignmentCall(req, res));


module.exports = router;