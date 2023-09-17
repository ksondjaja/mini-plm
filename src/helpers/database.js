var AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.VUE_APP_AWS_API_ID,
    secretAccessKey: process.env.VUE_APP_AWS_API_KEY,
    region: process.env.VUE_APP_AWS_API_REGION,
    endpoint: process.env.VUE_APP_AWS_API_ENDPOINT,
});

const db = new AWS.DynamoDB.DocumentClient({convertEmptyValues: true});

module.exports = db;