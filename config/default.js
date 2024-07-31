module.exports = {
    port: 3000,
    cors: {
        enabled: true,
        origin: "*"
    },
    logger: {
        transports: {
            console: {
                level: 'debug',
                preset: 'dev'
            }
        }
    },
    knex: {
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
    },
    routes_actions: {
        ["/create/:event_type"]: {
            POST: "param"
        },
        ["/:id_event"]: {
            PUT: "param"
        },
    }
}