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
            host: '',
            port: ,
            user: '',
            password: '',
            database: '',
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
