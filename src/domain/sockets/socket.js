const eventService = require('../eventService');
const roleService = require('../roleService');
const accessTokenModule = require('../../../private_modules/accessTokenModule');

module.exports = (http) => {
    const io = require('socket.io')(http, {
        cors: {
            origin: "*",
            methods: ["GET"]
        }
    });
    io.use(async function(socket, next) {
        try {
            await accessTokenModule.verifyJWT(socket.handshake.headers.authorization);
            next()
        } catch (err) {
            return err;
        }
    })
    io.on('connection', async(socket) => {
        //quitar esto una vez este terminada la fase de desarrollo (esto genera problemas cuando se cierra sesion y se inicia con otro usuario)
        const id = (await accessTokenModule.decodeJWT(socket.handshake.headers.authorization)).user.id_user;
        socket.on('get-all-inprogress-events' + id, async(msg) => {
            const getEvents = await eventService.getInProgressEvents();
            io.emit('get-all-inprogress-events' + id, getEvents);
        });
        socket.on('get-all-categories' + id, async(msg) => {
            const params = {
                id_event: msg.id_event
            }
            const getAllCategories = await eventService.getAllCategories(params);
            io.emit('get-all-categories' + id, getAllCategories);
        });
        socket.on('get-contact-detail' + id, async(msg) => {
            const params = {
                event_id: msg.id_event
            }
            const getContactDetail = await eventService.getContactDetail(params);
            io.emit('get-contact-detail' + id, getContactDetail);
        });
        socket.on('put-contact-detail' + id, async(msg) => {
            const params = {
                event_id: msg.id_event,
                datas: msg.datas
            }
            await eventService.putContactDetail(params);
            io.emit('put-contact-detail' + id, { counterProcess: msg.counterProcess });
        });
        socket.on('get-location' + id, async(msg) => {
            const params = {
                event_id: msg.id_event
            }
            const getLocation = await eventService.getLocation(params);
            io.emit('get-location' + id, getLocation);
        });
        socket.on('put-location' + id, async(msg) => {
            const params = {
                event_id: msg.id_event,
                datas: msg.datas
            }
            await eventService.putLocation(params);
            io.emit('put-location' + id, { counterProcess: msg.counterProcess });
        });
        socket.on('get-all-people' + id, async(msg) => {
            const params = {
                event_id: msg.id_event
            }
            const getAllPeople = await eventService.getPeople(params);
            io.emit('get-all-people' + id, getAllPeople);
        });
        socket.on('get-all-roles' + id, async() => {
            const getAllRoles = await roleService.getRole();
            io.emit('get-all-roles' + id, getAllRoles);
        });
    });
}