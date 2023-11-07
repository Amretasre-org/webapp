const express = require("express");
const router = express.Router();
const db = require("../models/index");
const StatsD = require('node-statsd');
const statsdClient = new StatsD();

function isRequestHeader(req, res) {
    if (req.headers['cache-control'] != "no-cache") {
        console.warn("cache contol header is missing");
        res.status(400).send();
        return false;
    } else if (JSON.stringify(req.query) != '{}') {
        console.warn("Param is not needed");
        res.status(400).send();
        return false;
    } else if (JSON.stringify(req.body) != '{}') {
        console.warn("Payload is not needed");
        res.status(400).send();
        return false;
    }
    else {
        return true;
    };
}

function checkGetCall(method = "Post", res) {
    console.log(`${method} Method Not allowed`);
    statsdClient.increment('api_calls');
    res.status(405).send();
}


router.get("/healthz", async (req, res) => {
    statsdClient.increment('api_calls');
    try {
        if (isRequestHeader(req, res)) {
            console.log("Healthy connection");
            await db.sequelize.authenticate();
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'no-cache');
            res.status(200).send();

        }
    } catch (err) {
        console.error(err);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-cache');
        res.status(503).send();
    }
});
router.post("/healthz", (req, res) => checkGetCall("post", res));
router.put("/healthz", (req, res) => checkGetCall("put", res));
router.delete("/healthz", (req, res) => checkGetCall("delete", res));
router.patch("/healthz", (req, res) => checkGetCall("patch", res));

module.exports = router;