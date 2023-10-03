const express = require("express");
const router = express.Router();
const db = require("../models/index");

function isRequestHeader(req, res) {
    console.log("request has come to health")

    console.log(db);
    if (req.headers['cache-control'] != "no-cache") {
        console.warn("cache contol header is missing");
        res.status(400).json({
            status: "Bad Request",
            message: "Cache-control Header missing"
        });
        return false;
    } else if (JSON.stringify(req.query) != '{}') {
        console.warn("Param is not needed");
        res.status(400).json({
            status: "Bad Request",
            message: "Parameters is not needed for this request"
        });
        return false;
    } else if (JSON.stringify(req.body) != '{}') {
        console.warn("Payload is not needed");
        res.status(400).json({
            status: "Bad Request",
            message: "Payload is not needed for this request"
        });
        return false;
    }
    else {
        return true;
    };
}

function checkGetCall(method = "Post", res) {
    res.status(405).json({
        status: "Method Not Allowed",
        message: `${method} method is not available`
    });
}


router.get("/healthz", async (req, res) => {
    console.log("GET /healthz");
    try {
        if (isRequestHeader(req, res)) {
            await db.sequelize.authenticate();
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'no-cache');
            res.status(200).json({
                status: "Ok",
                message: "Healthy, connection is established"
            });

        }
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-cache');
        res.status(503).json({
            status: "Service not available",
            message: "Connection is unsuccessful"
        })
    }
});
router.post("/healthz", (req, res) => checkGetCall("post", res));
router.put("/healthz", (req, res) => checkGetCall("put", res));
router.delete("/healthz", (req, res) => checkGetCall("delete", res));
router.patch("/healthz", (req, res) => checkGetCall("patch", res));

// app.use("/health", router);
module.exports = router;