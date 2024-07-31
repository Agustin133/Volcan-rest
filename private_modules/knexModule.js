const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'sql452.main-hosting.eu',
        port: 3306,
        user: 'u887929325_admin',
        password: 'RerUC4GUGNIIJoemYod1',
        database: 'u887929325_test_lab',
        timezone: "+03:00"
    },
    pool: {
        min: 0,
        max: 7
    }
});

function getKnex() {
    return knex;
}

module.exports = {
    getKnex
}