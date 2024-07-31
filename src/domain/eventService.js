const eventQueryService = require('../infrastructure/services/eventQueryService');
const categoryService = require('./categoryService');
const errorHandler = require('../../private_modules/buildErrorModule');
const httpContext = require('express-http-context');
const moment = require('moment');
const { x } = require('joi');

class EventService {
    async addEvent(params) {
        const dataToInsert = {};
        if (params.event_type == 'emergency') {
            dataToInsert['event_is_emergency'] = true;
        } else {
            dataToInsert['event_is_emergency'] = false;
        }
        try {
            const event = await eventQueryService.createEvent(dataToInsert);
            const contactDetail = {
                event_id: event[0],
                datas: {
                    event: {
                        contact_detail: {
                            name: "",
                            phone: "",
                            type: {
                                phone: false,
                                radio: false,
                                personally: false
                            }
                        }
                    }
                }
            };
            const location = {
                event_id: event[0],
                datas: {
                    event: {
                        location: {
                            primary_address: "",
                            secondary_address: "",
                            coordinates: ""
                        }
                    }
                }
            };
            await this.addLocation(location)
            await this.addContactDetail(contactDetail)
            const dataToEventUser = {
                user_id: httpContext.get('accessToken').user.id_user,
                event_id: event[0],
            };
            const eventUser = await eventQueryService.saveEventuser(dataToEventUser);
            const eventResponse = {
                event: {
                    id_event: event[0],
                    event_user: {
                        id_event_user: eventUser[0],
                    },
                },
            };
            return eventResponse;
        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);
        }
    }

    async updateEvent(params) {
        let message;
        try {
            if (params.event) {
                if (params.event.event_type == 'emergency') {
                    await eventQueryService.updateEvent({
                        data: { event_is_emergency: true },
                        id_event: params.id_event,
                    });
                } else if (params.event.event_type == 'drill') {
                    await eventQueryService.updateEvent({
                        data: { event_is_emergency: false },
                        id_event: params.id_event,
                    });
                }
                message = 'The event type was updated successfully';
            } else {
                await eventQueryService.finishEvent(params);
                message = 'The event was finished successfully';
            }
            return {
                event: {
                    message: message,
                },
            };
        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);
        }
    }

    async addPeople(params) {
        try {
            const data = {
                name: params.name,
                blood_type: params.blood_type,
                age: params.age,
                gender: false,
                allergies: params.allergies,
                other: params.other,
                event_id: params.event_id
            }
            if (params.gender == "male") {
                data.gender = true;
            }
            const idPeople = await eventQueryService.addPeople(data);
            const dataToReturn = {
                event: {
                    people: {
                        id: idPeople[0],
                        name: params.name,
                        blood_type: params.blood_type,
                        age: params.age,
                        gender: params.gender,
                        allegies: params.allegies,
                        other: params.other,
                    }
                }
            };
            return dataToReturn
        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);
        }
    }

    async getPeople(params) {
        try {
            const dataToReturn = await eventQueryService.getPeople(params);
            const newData = [];
            dataToReturn.forEach(people => {
                const newPeople = {
                    id_people: people.event_people_id,
                    name: people.event_people_name,
                    blood_type: people.event_people_blood_type,
                    age: people.event_people_age,
                    gender: people.event_people_gender,
                    allergies: people.event_people_allergies,
                    other: people.event_people_other
                };
                newData.push(newPeople);
            });
            return {
                event: {
                    people: newData,
                }
            };
        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);
        }
    }

    async putPeople(params) {
        let message;
        try {
            const dataToUpdate = {
                event_people_name: params.name,
                event_people_blood_type: params.blood_type,
                event_people_age: params.age,
                event_people_gender: params.gender,
                event_people_allergies: params.allergies,
                event_people_other: params.other
            }
            const whers = {
                event_id: params.event_id,
                event_people_id: params.people_id
            }
            await eventQueryService.putPeople(dataToUpdate, whers);
            message = 'The people was updated succesfully';
            return {
                message: message
            }
        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);
        }
    }

    async updateEvent(params) {
        let message;
        try {
            if (params.event) {
                if (params.event.event_type == 'emergency') {
                    await eventQueryService.updateEvent({
                        data: { event_is_emergency: true },
                        id_event: params.id_event,
                    });
                } else if (params.event.event_type == 'drill') {
                    await eventQueryService.updateEvent({
                        data: { event_is_emergency: false },
                        id_event: params.id_event,
                    });
                }
                message = 'The event type was updated successfully';
            } else {
                await eventQueryService.finishEvent(params);
                message = 'The event was finished successfully';
            }
            return {
                event: {
                    message: message,
                },
            };
        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);
        }
    }

    async addCategoryToEvent(params) {
        try {
            const category = params.category;
            const action = params.action;
            const actionCategoryId = params.action_category_id;
            const queryBody = {
                id_event: params.id_event
            };
            console.log(category);
            if (action) {
                if (actionCategoryId != category.id) {
                    category.sub_categories.forEach(async(sub_category) => {
                        if (actionCategoryId == sub_category.id) {
                            if (!category.value) {
                                queryBody["id_category"] = category.id;
                                await eventQueryService.addCategoryToEvent(queryBody);
                                queryBody["id_category"] = sub_category.id;
                                await eventQueryService.addCategoryToEvent(queryBody);
                            } else {
                                queryBody["id_category"] = sub_category.id;
                                await eventQueryService.addCategoryToEvent(queryBody);
                            }
                        }
                    })
                } else {
                    queryBody["id_category"] = category.id;
                    await eventQueryService.addCategoryToEvent(queryBody);
                }
            } else {
                if (actionCategoryId != category.id) {
                    category.sub_categories.forEach(async(sub_category) => {
                        if (actionCategoryId == sub_category.id) {
                            queryBody["id_category"] = sub_category.id;
                            await eventQueryService.deleteCategoryFromEvent(queryBody);
                        }
                    })
                } else {
                    category.sub_categories.forEach(async(sub_category) => {
                        if (sub_category.value) {
                            queryBody["id_category"] = sub_category.id;
                            await eventQueryService.deleteCategoryFromEvent(queryBody);
                        }
                    })
                    queryBody["id_category"] = category.id;
                    await eventQueryService.deleteCategoryFromEvent(queryBody);
                }

            }
            const dataToReturn = "OK"
            return dataToReturn;
        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);
        }
    }

    async getAllCategories(params) {
        try {
            const eventCategories = await eventQueryService.selectAllCategories(params);
            const allCategories = await categoryService.getCategories();
            const responseCategories = [];
            allCategories.categories.forEach((category) => {
                eventCategories.forEach((eventCategory) => {
                    if (category.id == eventCategory.category_id) {
                        category["value"] = true;
                    }
                })
                if (!category.value) {
                    category["value"] = false;
                }
                const newSubCategories = [];
                category.sub_categories.forEach((sub_category) => {
                    delete sub_category.style;
                    eventCategories.forEach((eventCategory) => {
                        if (sub_category.id == eventCategory.category_id) {
                            sub_category["value"] = true;
                        }
                    })
                    if (!sub_category.value) {
                        sub_category["value"] = false;
                    }
                    newSubCategories.push(sub_category);
                })
                category.sub_categories = newSubCategories;
                responseCategories.push(category);
            })
            const dataToReturn = {
                event: {
                    categories: responseCategories
                },
            };
            return dataToReturn;
        } catch (err) {
            console.log(err);
            throw errorHandler.buildErrorMysql(err.errno);
        }
    }

    async deletePeople(params) {
        let message;
        try {
            const data = {
                event_id: params.event_id,
                event_people_id: params.people_id
            }
            await eventQueryService.deletePeople(data);
            message = 'The people was deleted succesfully';
            return {
                message: message
            }
        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);
        }
    }

    async getPeopleById(params) {
        try {
            const dataToReturn = await eventQueryService.getPeopleById(params);
            const newData = [];
            dataToReturn.forEach(people => {
                const newPeople = {
                    id_people: people.event_people_id,
                    name: people.event_people_name,
                    blood_type: people.event_people_blood_type,
                    age: people.event_people_age,
                    gender: people.event_people_gender,
                    allergies: people.event_people_allergies,
                    other: people.event_people_other
                };
                newData.push(newPeople);
            });
            return {
                people: newData[0]
            };

        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);
        }
    }

    async getInProgressEvents() {
        const now = await eventQueryService.getNowTime();
        const events = await eventQueryService.selectAllInProgressEvents();
        const eventsWithoutCategories = await eventQueryService.selectAllInProgressEventsWithoutCategories();
        const newEvents = [];
        const emergencies = [];
        const drills = [];
        events.forEach((event) => {
            const found = newEvents.find(element => element.id_event == event.event_id);
            if (!found) {
                newEvents.push({ id_event: event.event_id, date: { created_on: this.convertDates(event.event_created_on), elapsed_time: this.getDiffDates(event.event_created_on, now[0][0]['NOW()']) }, categories: [], is_emergency: event.event_is_emergency })
            }
        })
        eventsWithoutCategories.forEach((eventWithoutCategories) => {
            const found = newEvents.find(element => element.id_event == eventWithoutCategories.event_id);
            if (!found) {
                newEvents.push({ id_event: eventWithoutCategories.event_id, date: { created_on: this.convertDates(eventWithoutCategories.event_created_on), elapsed_time: this.getDiffDates(eventWithoutCategories.event_created_on, now[0][0]['NOW()']) }, categories: [], is_emergency: eventWithoutCategories.event_is_emergency })
            }
        })
        newEvents.forEach((newEvent) => {
            events.forEach((event) => {
                if (newEvent.id_event == event.event_id && event.category_parent_category_id == null) {
                    newEvent.categories.push({ id: event.category_id, name: event.category_name, style: event.category_style })
                }
            })
            if (newEvent.is_emergency) {
                delete newEvent.is_emergency;
                emergencies.push(newEvent)
            } else {
                delete newEvent.is_emergency;
                drills.push(newEvent)
            }
        })
        const newEmergencies = emergencies.sort((a, b) => a.id_event - b.id_event)
        const newDrills = drills.sort((a, b) => a.id_event - b.id_event)
        return {
            event: {
                emergencies: newEmergencies,
                drills: newDrills
            }
        }
    }

    convertDates(oldDate) {
        const newDate = moment(oldDate).format('YYYY-MM-DD | HH:mm:ss')
        return newDate;
    }

    getDiffDates(oldDate, now) {
        const dateNow = moment(now);
        const diff = dateNow.diff(oldDate);
        const daysDiff = moment(diff).format("DD") - 1;
        const hoursDiff = moment(diff).format("HH:mm:ss");
        return {
            days: daysDiff,
            hours: hoursDiff
        };
    }

    async addContactDetail(params) {
        let message;
        try {
            const data = {
                event_contact_detail_name: params.datas.event.contact_detail.name,
                event_contact_detail_phone_number: params.datas.event.contact_detail.phone,
                event_contact_detail_type: params.datas.event.contact_detail.type,
                event_id: params.event_id
            }
            if (data.event_contact_detail_type.phone) {
                data.event_contact_detail_type = 1;
            } else if (data.event_contact_detail_type.radio) {
                data.event_contact_detail_type = 2;
            } else if (data.event_contact_detail_type.personally) {
                data.event_contact_detail_type = 3;
            } else {
                data.event_contact_detail_type = null;
            };
            await eventQueryService.addContactDetail(data);
            message = 'Added successfully';
            return {
                message
            };
        } catch (err) {
            console.log(err);
            throw errorHandler.buildErrorMysql(err.errno);
        };
    }

    async putContactDetail(params) {
        let message;
        try {
            const data = {
                event: {
                    event_contact_detail_name: params.datas.event.contact_detail.name,
                    event_contact_detail_phone_number: params.datas.event.contact_detail.phone,
                    event_contact_detail_type: params.datas.event.contact_detail.type,
                },
                event_id: params.event_id,
            }
            if (data.event.event_contact_detail_type.phone) {
                data.event.event_contact_detail_type = 1;
            } else if (data.event.event_contact_detail_type.radio) {
                data.event.event_contact_detail_type = 2;
            } else if (data.event.event_contact_detail_type.personally) {
                data.event.event_contact_detail_type = 3;
            } else {
                data.event.event_contact_detail_type = null;
            };
            await eventQueryService.putContactDetail(data);
            message = 'Updated successfully';
            return {
                message
            };
        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);
        };
    }

    async getContactDetail(data) {
        try {
            const response = (await eventQueryService.getContactDetail(data))[0];
            const responseBody = {
                event: {
                    contact_detail: {
                        name: response.event_contact_detail_name,
                        phone: response.event_contact_detail_phone_number
                    }
                }
            };
            if (response.event_contact_detail_type == 1) {
                responseBody.event.contact_detail["type"] = {
                    phone: true,
                    radio: false,
                    personally: false
                }
            }
            if (response.event_contact_detail_type == 2) {
                responseBody.event.contact_detail["type"] = {
                    phone: false,
                    radio: true,
                    personally: false
                }
            }
            if (response.event_contact_detail_type == 3) {
                responseBody.event.contact_detail["type"] = {
                    phone: false,
                    radio: false,
                    personally: true
                }
            }
            if (!response.event_contact_detail_type) {
                responseBody.event.contact_detail["type"] = {
                    phone: false,
                    radio: false,
                    personally: false
                }
            }
            return responseBody;
        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);
        };

    }

    async addLocation(params) {
        let message;
        try {
            const data = {
                event_location_primary_address: params.datas.event.location.primary_address,
                event_location_secondary_address: params.datas.event.location.secondary_address,
                event_location_coordinates: params.datas.event.location.coordinates,
                event_id: params.event_id
            }
            await eventQueryService.addLocation(data);
            message = 'Added successfully';
            return {
                message
            };
        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);
        };
    }

    async putLocation(params) {
        let message;
        try {
            const data = {
                event_location_primary_address: params.datas.event.location.primary_address,
                event_location_secondary_address: params.datas.event.location.secondary_address,
                event_location_coordinates: params.datas.event.location.coordinates,
                event_id: params.event_id
            }
            await eventQueryService.putLocation(data);
            message = 'Updated successfully';
            return {
                message
            };
        } catch (err) {
            console.log(err);
            throw errorHandler.buildErrorMysql(err.errno);
        };
    }

    async getLocation(params) {
        try {
            const data = {
                event_id: params.event_id
            }
            const response = (await eventQueryService.getLocation(data))[0];
            const responseBody = {
                event: {
                    location: {
                        primary_address: response.event_location_primary_address,
                        secondary_address: response.event_location_secondary_address,
                        coordinates: response.event_location_coordinates
                    }
                }
            };
            return responseBody;
        } catch (err) {
            console.log(err);
            throw errorHandler.buildErrorMysql(err.errno);
        };
    }

    async getNotes(params) {
        try {
            const response = await eventQueryService.getNotes(params);
            const responseBody = {
                event: {
                    notes: response,
                }
            };
            return responseBody;
        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);
        }
    }

    async addNote(params) {
        let message;
        try {
            const data = {
                event_note_content: params.datas.event.note.body,
                event_note_style: params.datas.event.note.style,
                event_id: params.event_id
            }
            await eventQueryService.addNote(data);
            message = 'Added successfully';
            return {
                message
            };
        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);
        }
    }

    async putNote(params) {
        let message;
        try {
            const data = {
                datas: {
                    event_note_content: params.datas.event.note.body,
                    event_note_style: params.datas.event.note.style,
                },
                event_id: params.event_id,
                event_note_id: params.note_id
            }
            await eventQueryService.putNote(data);
            message = 'Updated successfully';
            return {
                message
            };
        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);        
        };
    }
    
}

module.exports = new EventService();