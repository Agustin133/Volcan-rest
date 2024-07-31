const NodeCache = require("node-cache");
const nodeCache = new NodeCache();

function setKey(name, value, time) {
    try {
        nodeCache.set(name, value, time);
    } catch (err) {
        console.log(err);
    }

}

function getKey(value) {
    return nodeCache.get(value);
}

function delKey(value) {
    try {
        nodeCache.del(value);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

function hasKey(value) {
    return nodeCache.has(value);
}

module.exports = {
    setKey,
    getKey,
    delKey,
    hasKey
}