const assistanceQueryService = require('../infrastructure/services/assistanceQueryService');
const errorHandler = require('../../private_modules/buildErrorModule');

class AssistanceService {
    async addAssistance(params) {
        let message;
        try {
            const data = {
                assistance_name: params.assistance.name,
                assistance_can_have_passengers: params.assistance.can_have_passengers,
                assistance_license_plate: params.assistance.license_plate,
                assistance_description: params.assistance.description
            }
            await assistanceQueryService.addAssistance(data);
            message = 'Added successfully';
            return {
                message
            };
        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);
        };
    }

    async getAssistance(params) {
        try {
            const response = (await assistanceQueryService.getAssistance(params))[0];
            console.log(response);
            const responseBody = {
                assistance: {
                    name: response.assistance_name,
                    can_have_passengers: response.assistance_can_have_passengers ? true : false,
                    license_plate: response.assistance_license_plate,
                    description: response.assistance_description
                }
            }
            return responseBody;
        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);
        }
    }

    async putAssistance(params) {
        let message;
        try {
            const data = {
                body: {
                    assistance_name: params.datas.assistance.name,
                    assistance_can_have_passengers: params.datas.assistance.can_have_passengers,
                    assistance_license_plate: params.datas.assistance.license_plate,
                    assistance_description: params.datas.assistance.description
                },
                id: {
                    assistance_id: params.assistance_id
                }
            }
            await assistanceQueryService.putAssistance(data);
            message = 'Updated successfully';
            return {
                message
            };
        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);
        };
    }

    async deleteAssistance(params) {
        let message;
        try {
            await assistanceQueryService.deleteAssistance(params);
            message = 'Deleted successfully';
            return {
                message
            };
        } catch (err) {
            throw errorHandler.buildErrorMysql(err.errno);
        }
    }
}

module.exports = new AssistanceService();