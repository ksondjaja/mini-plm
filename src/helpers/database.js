var AWS = require('aws-sdk');

console.log(process.env.VUE_APP_AWS_ACCESS_KEY);
console.log(process.env.VUE_APP_AWS_SECRET_ACCESS_KEY);

AWS.config.update({
    apiVersion: 'latest',
    accessKeyId: process.env.VUE_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.VUE_APP_AWS_SECRET_ACCESS_KEY,
    region: 'us-east-2',
    endpoint: 'dynamodb.us-east-2.amazonaws.com'
});

const db = new AWS.DynamoDB.DocumentClient({convertEmptyValues: true});

module.exports = db;