const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");
const db = require("../models");

router.post("/", (req, res) => {
    assignmentController.createAssignment(req, res, db);
});

router.get("/", (req, res) => assignmentController.displayAllAssignments(req, res, db));

router.get("/:id", (req, res) => assignmentController.getAssignment(req, res, db));

router.put("/:id", (req, res) => assignmentController.updateAssignment(req, res, db));

router.delete("/:id", (req, res) => assignmentController.deleteAssignment(req, res, db));

module.exports = router;