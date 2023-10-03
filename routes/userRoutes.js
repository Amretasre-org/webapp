const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const db = require("../models");

// Define your routes
router.get("/getUsers", (req, res) => userController.getUsers(req, res, db));
router.post("/loginUser/:email", (req, res) => {
    console.log("post call for user");
    userController.loginUser(req, res, db)
});

// Export the router
module.exports = router;
