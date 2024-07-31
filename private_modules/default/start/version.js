const versionMiddleware = function() {
    return function(req, res) {
        res.json({
            version: 'N/A',
            description: 'N/A',
            name: 'N/A',
        });
    };
};
module.exports = versionMiddleware;