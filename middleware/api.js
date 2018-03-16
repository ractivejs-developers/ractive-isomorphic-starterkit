const proxy = require('express-http-proxy');

const config = require('../config/api.json');

module.exports = () => (req, res, next) => {
    proxy(config.backendURL, {
        https: config.https,
        timeout: config.timeout
    })(req, res, next);
};