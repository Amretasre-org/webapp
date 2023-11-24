const utils = require("../utils/bcrypting")
const express = require("express");
const router = express.Router();
const db = require("../models/index");
const StatsD = require('node-statsd');
const statsdClient = new StatsD(({
    host: 'localhost',  
    port: 8125,          
  }));
const log4js = require('../log4js-config');
const logger = log4js.getLogger();

// function isRequestHeader(req, res) {
//     if (JSON.stringify(req.query) != '{}') {
//         console.error("Param is not needed for Health route");
//         logger.error("Param is not needed for Health route");
//         res.status(400).send();
//         return false;
//     } else if (JSON.stringify(req.body) != '{}') {
//         console.error("Payload is not needed for Health route");
//         logger.error("Payload is not needed for Health route");
//         res.status(400).send();
//         return false;
//     }
//     else {
//         return true;
//     };
// }

// function otherMethodCheck(method = "post", res) {
//     console.log(`${method} method Not allowed`);
//     logger.info(`${method} method Not allowed in health route`);
//     statsdClient.increment(`${method}.healthz`);
//     res.status(405).send();
// }


router.get("/healthz", async (req, res) => {
    try {
        statsdClient.increment('get.healthz');
        if (utils.isRequestHeader(req, res)) {
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
router.post("/healthz", (req, res) => utils.otherMethodCheck("post", res));
router.put("/healthz", (req, res) => utils.otherMethodCheck("put", res));
router.delete("/healthz", (req, res) => utils.otherMethodCheck("delete", res));
router.patch("/healthz", (req, res) => utils.otherMethodCheck("patch", res));

module.exports = router;