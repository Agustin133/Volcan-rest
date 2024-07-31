const Joi = require('joi');
const joiValid = require('../../../private_modules/validators/joiValidator');
const eventService = require('../../domain/eventService');
const errorHandler = require('../../../private_modules/buildErrorModule')

async function addEvent(req, res) {
    const data = { event_type: req.params.event_type };
    const schema = Joi.object().keys({
        event_type: Joi.string()
            .required()
            .valid('emergency', 'drill'),
    });
    joiValid(schema, data);
    const response = await eventService.addEvent(data);
    res.json(response);
}

async function putEvent(req, res) {
    const data = { id_event: req.params.id_event, action: req.body.action };
    const schema = Joi.object()
        .required()
        .keys({
            id_event: Joi.number().required(),
            action: Joi.string()
                .required()
                .valid('change_type', 'finish_event'),
        });
    joiValid(schema, data);
    if (req.body.action == 'change_type') {
        const newData = req.body.event;
        const newSchema = Joi.object()
            .required()
            .keys({
                event_type: Joi.string()
                    .required()
                    .valid('emergency', 'drill'),
            });
        joiValid(newSchema, newData);
        data['event'] = req.body.event;
    }
    const response = await eventService.updateEvent(data);
    res.json(response);
}

async function addCategory(req, res) {
    const data = req.body;
    data["id_event"] = req.params.id_event;
    const schema = Joi.object()
        .required()
        .keys({
            id_event: Joi.number().required(),
            action: Joi.boolean().required(),
            action_category_id: Joi.number().required(),
            category: Joi.object().required().keys({
                id: Joi.number().required(),
                name: Joi.string(),
                style: Joi.string(),
                value: Joi.boolean().required(),
                sub_categories: Joi.array().required().items(Joi.object().keys({
                    id: Joi.number().required(),
                    name: Joi.string(),
                    style: Joi.string(),
                    value: Joi.boolean().required(),
                }))
            })
        });
    joiValid(schema, data);
    const response = await eventService.addCategoryToEvent(data);
    res.json(response);
}

async function addPeople(req, res) {
    const data = {
        event_id: req.params.event_id,
        name: req.body.event.people.name,
        blood_type: req.body.event.people.blood_type,
        age: req.body.event.people.age,
        gender: req.body.event.people.gender,
        allergies: req.body.event.people.allergies,
        other: req.body.event.people.other
    }
    const schema = Joi.object()
        .required()
        .keys({
            event_id: Joi.number().required(),
            name: Joi.string().required(),
            blood_type: Joi.string().required(),
            age: Joi.number().required(),
            gender: Joi.string().required().valid("female", "male"),
            allergies: Joi.string().required(),
            other: Joi.string().required()
        });
    joiValid(schema, data);
    const response = await eventService.addPeople(data)
    res.json(response);
}

async function getPeople(req, res) {
    const data = {
        event_id: req.params.event_id
    }
    const schema = Joi.object().required().keys({
        event_id: Joi.number().required()
    })
    joiValid(schema, data);
    const response = await eventService.getPeople(data);
    res.json(response);
}

async function putPeople(req, res) {
    const data = {
        event_id: req.params.event_id,
        people_id: req.params.people_id,
        name: req.body.event.people.name,
        blood_type: req.body.event.people.blood_type,
        age: req.body.event.people.age,
        gender: req.body.event.people.gender,
        allergies: req.body.event.people.allergies,
        other: req.body.event.people.other
    }
    const schema = Joi.object().required().keys({
        event_id: Joi.number().required(),
        people_id: Joi.number().required(),
        name: Joi.string().required(),
        blood_type: Joi.string().required(),
        age: Joi.number().required(),
        gender: Joi.string().required().valid("female", "male"),
        allergies: Joi.string().required(),
        other: Joi.string().required(),
    })
    joiValid(schema, data);
    const response = await eventService.putPeople(data);
    res.json(response);
}

async function deletePeople(req, res) {
    const data = {
        event_id: req.params.event_id,
        people_id: req.params.people_id
    }
    const schema = Joi.object().required().keys({
        event_id: Joi.number().required(),
        people_id: Joi.number().required()
    })
    joiValid(schema, data);
    const response = await eventService.deletePeople(data);
    res.json(response);
}

async function getPeopleById(req, res) {
    const data = {
        event_id: req.params.event_id,
        people_id: req.params.people_id
    }
    const schema = Joi.object().required().keys({
        event_id: Joi.number().required(),
        people_id: Joi.number().required()
    })
    joiValid(schema, data);
    const response = await eventService.getPeopleById(data);
    res.json(response);
}

async function getEventCategories(req, res) {
    const data = {
        id_event: req.params.id_event
    };
    const schema = Joi.object().required().keys({
        id_event: Joi.number().required()
    });
    joiValid(schema, data);
    const response = await eventService.getAllCategories(data);
    res.json(response);
}

async function getInprogressEvent(req, res) {
    const response = await eventService.getInProgressEvents();
    res.json(response);
}

async function addContactDetail(req, res) {
    const data = {
        datas: req.body,
        event_id: req.params.id_event
    };
    const schema1 = Joi.object().required().keys({
        event: Joi.object().required().keys({
            contact_detail: Joi.object().required().keys({
                name: Joi.string().required().allow(""),
                phone: Joi.number().required().allow(""),
                type: Joi.object().required().keys({
                    phone: Joi.boolean().optional(),
                    radio: Joi.boolean().optional(),
                    personally: Joi.boolean().optional()
                })
            })
        })
    });
    joiValid(schema1, data.datas);
    let counter = 0;
    if (data.datas.event.contact_detail.type.phone) {
        counter = counter + 1;
    }
    if (data.datas.event.contact_detail.type.radio) {
        counter = counter + 1;
    }
    if (data.datas.event.contact_detail.type.personally) {
        counter = counter + 1;
    }
    if (counter > 1) {
        throw errorHandler.buildError('bad_request');
    }
    const response = await eventService.addContactDetail(data);
    res.json(response);
}

async function putContactDetail(req, res) {
    const data = {
        datas: req.body,
        event_id: req.params.id_event
    };
    const schema1 = Joi.object().required().keys({
        event: Joi.object().required().keys({
            contact_detail: Joi.object().required().keys({
                name: Joi.string().required().allow(""),
                phone: Joi.number().required().allow("").unsafe(),
                type: Joi.object().required().keys({
                    phone: Joi.boolean().optional(),
                    radio: Joi.boolean().optional(),
                    personally: Joi.boolean().optional()
                })
            })
        })
    });
    joiValid(schema1, data.datas);
    let counter = 0;
    if (data.datas.event.contact_detail.type.phone) {
        counter = counter + 1;
    }
    if (data.datas.event.contact_detail.type.radio) {
        counter = counter + 1;
    }
    if (data.datas.event.contact_detail.type.personally) {
        counter = counter + 1;
    }
    if (counter > 1) {
        throw errorHandler.buildError('bad_request');
    }
    const response = await eventService.putContactDetail(data);
    res.json(response);
}

async function getContactDetail(req, res) {
    const data = {
        event_id: req.params.id_event
    };
    const schema1 = Joi.object().required().keys({
        event_id: Joi.number().required()
    });
    joiValid(schema1, data);
    const response = await eventService.getContactDetail(data);
    res.json(response);
}

async function addLocation(req, res) {
    const data = {
        datas: req.body,
        event_id: req.params.id_event
    };
    const schema1 = Joi.object().required().keys({
        event: Joi.object().required().keys({
            location: Joi.object().required().keys({
                primary_address: Joi.string().required().allow(""),
                secondary_address: Joi.string().required().allow(""),
                coordinates: Joi.string().required().allow(""),
            })
        })
    });
    joiValid(schema1, data.datas);
    const response = await eventService.addLocation(data);
    res.json(response);
}

async function putLocation(req, res) {
    const data = {
        datas: req.body,
        event_id: req.params.id_event
    };
    const schema1 = Joi.object().required().keys({
        event: Joi.object().required().keys({
            location: Joi.object().required().keys({
                primary_address: Joi.string().required().allow(""),
                secondary_address: Joi.string().required().allow(""),
                coordinates: Joi.string().required().allow(""),
            })
        })
    });
    joiValid(schema1, data.datas);
    const response = await eventService.putLocation(data);
    res.json(response);
}

async function getLocation(req, res) {
    const data = {
        event_id: req.params.id_event
    };
    const schema1 = Joi.object().required().keys({
        event_id: Joi.number().required(),
    });
    joiValid(schema1, data);
    const response = await eventService.getLocation(data);
    res.json(response);
}

async function getNotes(req, res) {
    const data = {
        event_id: req.params.id_event
    };
    const schema = Joi.object().required().keys({
        event_id: Joi.number().required()
    });
    joiValid(schema, data);
    const response = await eventService.getNotes(data);
    res.json(response);
}

async function addNote(req, res) {
    const data = {
        event_id: req.params.id_event,
        datas: req.body
    };
    const schema = Joi.object().required().keys({
        event: Joi.object().required().keys({
            note: Joi.object().required().keys({
                style: Joi.string().required(),
                body: Joi.string().required()
            })
        })
    });
    joiValid(schema, data.datas);
    const response = await eventService.addNote(data);
    res.json(response);
}

async function putNote(req, res) {
    const data = {
        datas: req.body,
        event_id: req.params.id_event,
        note_id: req.params.note_id
    };
    const schema = Joi.object().required().keys({
        event: Joi.object().required().keys({
            note: Joi.object().required().keys({
                style: Joi.string().required(),
                body: Joi.string().required()
            })
        })
    });
    joiValid(schema, data.datas);
    const response = await eventService.putNote(data);
    res.json(response);
}

module.exports = {
    addEvent,
    putEvent,
    addCategory,
    addPeople,
    getPeople,
    putPeople,
    deletePeople,
    getPeopleById,
    getEventCategories,
    getInprogressEvent,
    addContactDetail,
    putContactDetail,
    getContactDetail,
    addLocation,
    putLocation,
    getLocation,
    getNotes,
    addNote,
    putNote
};