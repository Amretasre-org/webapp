const bcrypt = require('bcrypt');
const base64 = require("base-64");
const log4js = require('../log4js-config');
const logger = log4js.getLogger();
const StatsD = require('node-statsd');
const statsdClient = new StatsD(({
    host: 'localhost',  
    port: 8125,          
  }));
const sns = new AWS.SNS();

function bcryptingPassword(password) {
    try {
        const saltRounds = 10; 
        const hash = bcrypt.hashSync(password, saltRounds);
        return hash;
    } catch (err) {
        logger.error("Error in hashing password: ", err);
        console.error('Error hashing password: ', err);
        throw err; 
    }
}

function decodeUserEmail(req) {
    const authHeader = req.headers['authorization'];
    const credentials = base64.decode(authHeader.split(' ')[1]);
    const [email, password] = credentials.split(':');
    return email;
}

async function publishToSNS(params) {
    return new Promise((resolve, reject) => {
        sns.publish(params, (err, data) => {
            if (err) {
                console.error('Error publishing message to SNS:', err);
                logger.error('Error publishing message to SNS:', err);
                reject(err);
            } else {
                console.log('Message published to SNS:', data);
                logger.info('Message published to SNS:', data);
                resolve(data);
            }
        });
    });
}

function containsURL(requestBody) {
    var urlPattern = /https?:\/\/\S+/;
    return urlPattern.test(requestBody);
}

// Health route helper methods

function otherMethodCheck(method = "post", res) {
    console.log(`${method} method Not allowed`);
    logger.info(`${method} method Not allowed in health route`);
    statsdClient.increment(`${method}.healthz`);
    res.status(405).send();
}

function isRequestHeader(req, res) {
    if (JSON.stringify(req.query) != '{}') {
        console.error("Param is not needed for Health route");
        logger.error("Param is not needed for Health route");
        res.status(400).send();
        return false;
    } else if (JSON.stringify(req.body) != '{}') {
        console.error("Payload is not needed for Health route");
        logger.error("Payload is not needed for Health route");
        res.status(400).send();
        return false;
    }
    else {
        return true;
    };
}

module.exports = {
    bcryptingPassword,
    decodeUserEmail,
    publishToSNS,
    containsURL,
    otherMethodCheck,
    isRequestHeader
}
