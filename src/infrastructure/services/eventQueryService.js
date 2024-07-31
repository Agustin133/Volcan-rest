const knex = require('../../../private_modules/knexModule').getKnex();

class EventQueryService {
    async createEvent(dataToInsert) {
        return await knex('event').insert(dataToInsert);
    }

    async selectAllCategories(dataToInsert) {
        return await knex('event_category').select().where({ event_id: dataToInsert.id_event })
    }

    async getNowTime() {
        return await knex.raw("SELECT NOW()");
    }

    async selectAllInProgressEvents() {
        return await knex('event')
            .select()
            .join('event_category', { 'event_category.event_id': 'event.event_id' })
            .join('category', { 'event_category.category_id': 'category.category_id' })
            .where({ event_finished_on: null })
    }

    async selectAllInProgressEventsWithoutCategories() {
        return await knex('event')
            .select()
            .where({ event_finished_on: null })
    }

    async saveEventuser(dataToInsert) {
        return await knex('event_user').insert(dataToInsert);
    }

    async updateEvent(dataToUpdate) {
        return await knex('event')
            .update(dataToUpdate.data)
            .where({ event_id: dataToUpdate.id_event });
    }

    async finishEvent(dataToUpdate) {
        return await knex('event')
            .update({ event_finished_on: knex.fn.now() })
            .where({ event_id: dataToUpdate.id_event });
    }

    async addCategoryToEvent(dataToInsert) {
        return await knex('event_category').insert({
            event_id: dataToInsert.id_event,
            category_id: dataToInsert.id_category,
        });
    }

    async addPeople(dataToInsert) {
        return await knex('event_people').insert({
            event_people_name: dataToInsert.name,
            event_people_blood_type: dataToInsert.blood_type,
            event_people_age: dataToInsert.age,
            event_people_gender: dataToInsert.gender,
            event_people_allergies: dataToInsert.allergies,
            event_people_other: dataToInsert.other,
            event_id: dataToInsert.event_id,
        });
    }

    async getPeople(data) {
        return await knex('event_people')
            .select()
            .where({
                event_id: data.event_id
            });
    }

    async putPeople(dataToInsert, wheres) {
        return await knex('event_people')
            .update(dataToInsert)
            .where(wheres);
    }

    async deletePeople(data) {
        return await knex('event_people')
            .delete()
            .where(data);
    }

    async getPeopleById(data) {
        return await knex('event_people')
            .select()
            .where({
                event_id: data.event_id,
                event_people_id: data.people_id
            });
    }

    async deleteCategoryFromEvent(dataToInsert) {
        return await knex('event_category').delete().where({ event_id: dataToInsert.id_event, category_id: dataToInsert.id_category });
    }

    async addContactDetail(dataToInsert) {
        return await knex('event_contact_detail').insert(dataToInsert);
    }

    async putContactDetail(dataToInsert) {
        return await knex('event_contact_detail')
            .update(dataToInsert.event)
            .where({
                event_id: dataToInsert.event_id
            });
    }

    async getContactDetail(data) {
        return await knex('event_contact_detail').select().where({ event_id: data.event_id });
    }

    async addLocation(dataToInsert) {
        return await knex('event_location').insert(dataToInsert);
    }

    async putLocation(dataToInsert) {
        return await knex('event_location').update(dataToInsert).where({ event_id: dataToInsert.event_id });
    }

    async getLocation(dataToGet) {
        return await knex('event_location').select().where({ event_id: dataToGet.event_id });
    }

    async getNotes(dataToGet) {
        return await knex('event_note').select().where({ event_id: dataToGet.event_id });
    }

    async addNote(dataToInsert) {
        return await knex('event_note').insert(dataToInsert);
    }
    
    async putNote(dataToUpdate) {
        return await knex('event_note')
            .update(dataToUpdate.datas)
            .where({ event_id: dataToUpdate.event_id, event_note_id: dataToUpdate.event_note_id });
    }
}

module.exports = new EventQueryService();