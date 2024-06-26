// logger.js

const logger = (req, res, next) => {
    // Log the request method and URL
    console.log(`${req.method} ${req.url}`);

    // Call the next middleware function
    next();
};

module.exports = logger;