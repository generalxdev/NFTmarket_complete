const bunyan = require('bunyan');

const logger = bunyan.createLogger({
    name: ' ',
    streams: [/*{
        type: 'rotating-file',
        path: '../log/api.log',
        period: '1d',   // daily rotation
        count: 7        // keep 7 back copies
    },*/
    {
        level: 'trace',
        stream: process.stdout
    }]
});

module.exports = options => {
    return {
        info: (...args) => {
            logger.info(...args);
        },
        warn: (...args) => {
            logger.warn(...args);
        },
        error: (...args) => {
            logger.error(...args);
        },
        debug: (...args) => {
            logger.debug(...args);
      },
    };
};
