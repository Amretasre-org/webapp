const AWS = require('aws-sdk');
require('dotenv').config();
AWS.config.update({
  region: process.env.region || 'us-east-1',
  credentials: {
    accessKeyId: process.env.accessId,
    secretAccessKey: process.env.secretAccessKey,
  },
});

module.exports = AWS;