const router = require('express').Router();

router.use('/upload', require('./upload'));

router.use('/health', (_req, res) => {
    res.status(200).send('success');
});

module.exports = router;
