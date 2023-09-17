// based on tutorial https://faerulsalamun.medium.com/restful-api-with-node-js-express-and-dynamodb-5059beb3ba7f

const db = require('../../../helpers/database');
const {v4: uuidv4} = require('uuid');
const timestamp = new Date().toISOString(); 

class StyleRepository {
    constructor() {
        this.tableName = 'Styles';
    }

    async findById(StyleId) {
        const params = {
            TableName: this.tableName,
            Key: {
                StyleId,
            },
        };

        return await db.get(params).promise();
    }

    async create(data) {
        const params = {
            TableName: this.tableName,
            Item: {
                StyleId: uuidv4(),
                StyleName: data.StyleName,
                StyleNumber: data.StyleNumber,
                Season: data.Season,
                Category: data.Category,
                SizeRange: data.SizeRange,
                DeliveryDate: data.DeliveryDate,
                History:{
                    Created: timestamp,
                    LastUpdated: timestamp,
                }
            },
        };

        await db.put(params).promise();

        return params.Item;
    }

    async update(StyleId) {
        const params = {
            TableName: this.tableName,
            Key: {
                StyleId: StyleId
            },
            UpdateExpression: 'set #{LastUpdated} = :LastUpdated',
            ExpressionAttributeNames: {
                '#LastUpdated': 'LastUpdated',
            },
            ExpressionAttributeValues: {
                ':LastUpdated': timestamp,
            },
            ReturnValues: `UPDATED_NEW`,
        };

        const update = await db.update(params).promise();

        return update.Attributes;
    }

    async deleteById(StyleId) {
        const params = {
            TableName: this.tableName,
            Key: {
                StyleId,
            },
        };

        return await db.delete(params).promise();
    }
}

module.exports = new StyleRepository();