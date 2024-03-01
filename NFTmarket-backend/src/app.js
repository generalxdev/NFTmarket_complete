const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const log = require('./lib/logger')();

const middlewares = require('./middlewares');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: '🌈🦄✨👋🌎🌍🌏👋✨🦄🌈'
    });
});

app.use('/api', require('./api'));

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
