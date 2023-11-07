const log4js = require('log4js');
const cloudwatchAppender = require('log4js-cloudwatch-appender');

log4js.configure({
  appenders: {
    cloudwatch: {
      type: 'log4js-cloudwatch-appender',
      logGroup: 'csye6225',  
      logStream: 'log4js-log',  
      region: 'us-east-1',  
    },
    console: {
      type: 'console',
    },
  },
  categories: {
    default: { appenders: ['cloudwatch', 'console'], level: 'info' },
  },
});

module.exports = log4js;
