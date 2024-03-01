require('dotenv').config();
const app = require('./app');
const log = require('./lib/logger')();

const PORT = process.env.PORT || 80;
//const ADDR = process.env.ADDR || 'localhost';
//app.listen(PORT, ADDR);

const start = async () => {
    app.listen(PORT, () => {
        /* eslint-disable no-console */
        log.info(`Listening: http://localhost:${PORT}`);
        /* eslint-enable no-console */
    });
}

// Run the server!
start();