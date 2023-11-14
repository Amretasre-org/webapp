const express = require("express");
const router = express.Router();
const db = require("../models/index");
const StatsD = require('node-statsd');
const statsdClient = new StatsD(({
    host: 'localhost',  // Since it's on the same instance
    port: 8125,          // The port where the CloudWatch Agent is listening
  }));
const log4js = require('../log4js-config');

const logger = log4js.getLogger();

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

function checkGetCall(method = "post", res) {
    console.log(`${method} method Not allowed`);
    logger.info(`${method} method Not allowed in health route`);
    statsdClient.increment(`${method}.healthz`);
    res.status(405).send();
}


router.get("/healthz", async (req, res) => {
    try {
        statsdClient.increment('get.healthz');
        if (isRequestHeader(req, res)) {
            console.log("Healthy connection");
            logger.info("Healthy connection established");
            await db.sequelize.authenticate();
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'no-cache');
            res.status(200).send();
        }
    } catch (err) {
        console.error(err);
        logger.error("Error in get health route");
        logger.error(err);
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