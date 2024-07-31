const knex = require('../../../private_modules/knexModule').getKnex();

class CategoryQueryService {
    async selectCategories() {
        return await knex('category').select();
    }
    async updateCategory(dataToInsert) {
        return await knex('category')
            .update({ category_name: dataToInsert.category_name, category_style: dataToInsert.category_style })
            .where({ category_id: dataToInsert.category_id });
    }
    async selectCategory(dataToSelect) {
        return await knex('category').select().where({ category_id: dataToSelect.category_id });
    }

    async deleteCategory(dataToDelete) {
        return await knex('category').delete().where({ category_id: dataToDelete.category_id });
    }

    async deleteCategoryChild(dataToDelete) {
        return await knex('category').delete().where({ category_parent_category_id: dataToDelete.category_id });
    }

    async insertCategory(dataToInsert) {
        return await knex('category').insert({ category_name: dataToInsert.category.name, category_style: dataToInsert.category.style, category_parent_category_id: dataToInsert.category.parent_id_category });
    }
}

module.exports = new CategoryQueryService();