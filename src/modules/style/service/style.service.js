// based on tutorial https://faerulsalamun.medium.com/restful-api-with-node-js-express-and-dynamodb-5059beb3ba7f

const StyleRepository = require('../repository/style.repository');

class StyleService {

    async findById(StyleId) {
        const data = await StyleRepository.findByID(StyleId);

        if (data) {
            return data.Item;
        }

        return data;
    }

    async create(data) {
        return await StyleRepository.create({
            StyleName: data.StyleName,
            StyleNumber: data.StyleNumber,
            Season: data.Season,
            Category: data.Category,
            SizeRange: data.SizeRange,
            DeliveryDate: data.DeliveryDate,
            History:data.History
        });
    }

    async update(StyleId, data) {
        return await StyleRepository.update(StyleId, data);
    }

    async deleteById(StyleId) {
        return await StyleRepository.deleteById(StyleId);
    }

}

module.exports = new StyleService()