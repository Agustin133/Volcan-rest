const categoryQueryService = require('../infrastructure/services/categoryQueryService');
const errorHandler = require('../../private_modules/buildErrorModule');
class EventService {
    async addNewCategory(params) {
        try {
            const response = await categoryQueryService.insertCategory(params);
            const dataToReturn = {
                category: {
                    id_category: response[0],
                    name: params.category.name,
                    parent_id_category: params.category.parent_id_category ? params.category.parent_id_category : null,
                    style: params.category.style
                }
            }
            return dataToReturn;
        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);
        }
    }

    async deleteCategory(params) {
        let message;
        try {
            const dataToDelete = {
                category_id: params.id_category
            }
            message = 'The category was deleted succesfully'
            const category = await categoryQueryService.selectCategory(dataToDelete);
            if (category[0].category_parent_category_id) {
                await categoryQueryService.deleteCategory(dataToDelete);
                return {
                    message
                };
            } else {
                await categoryQueryService.deleteCategory(dataToDelete);
                await categoryQueryService.deleteCategoryChild(dataToDelete);
                return {
                    message
                };
            }
        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);
        }
    }

    async updateCategory(params) {
        let message;
        try {
            const dataToUpdate = {
                category_name: params.name,
                category_id: params.id_category,
                category_style: params.style
            };
            await categoryQueryService.updateCategory(dataToUpdate);
            message = 'The category was updated succesfully';
            return {
                message
            };
        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);
        }
    }

    async getCategories() {
        try {
            const serviceResponse = await categoryQueryService.selectCategories();
            const categories = [];
            const subCategories = [];
            const categoriesToReturn = {
                categories: [],
            };
            serviceResponse.forEach((category) => {
                const categoryToPush = {
                    id: category.category_id,
                    name: category.category_name,
                    style: category.category_style
                };
                if (category.category_parent_category_id) {
                    categoryToPush['parent_id_category'] = category.category_parent_category_id;
                    subCategories.push(categoryToPush);
                } else {
                    categories.push(categoryToPush);
                }
            });
            categories.forEach((category) => {
                category['sub_categories'] = [];
                subCategories.forEach((subCategory) => {
                    if (subCategory.parent_id_category == category.id) {
                        delete subCategory.parent_id_category;
                        category.sub_categories.push(subCategory);
                    }
                });
                categoriesToReturn.categories.push(category);
            });
            return categoriesToReturn;
        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);
        }
    }
}

module.exports = new EventService();