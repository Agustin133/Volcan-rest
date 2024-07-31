const config = require('config');
const recursiveJSONKeyTransform = require('recursive-json-key-transform');
const snakeCase = require('lodash.snakecase');

const convertAllKeysToSnakeCase = (
    recursiveJSONKeyTransform((key) => {
        return snakeCase(key);
    })
);

const fieldsBlacklist = require('./dictionary/defaultFieldsBlacklist.json').fields;
let customFieldsBlacklist = [];
const blacklistExtend = fieldsBlacklist.concat(customFieldsBlacklist);
const maskJson = require('mask-json')(blacklistExtend, {
    replacement: '***MASKED***',
});

module.exports = {
    maskJson,
    convertAllKeysToSnakeCase,
};