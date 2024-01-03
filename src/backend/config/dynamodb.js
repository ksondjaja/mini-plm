// https://tapiwanashekanda.hashnode.dev/how-to-create-a-crud-api-using-expressjs-and-aws-dynamodb

const AWS = require('aws-sdk');
const variables = require('dotenv').config({ path: '../../.env.local' });

console.log(variables);

AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();

const TABLE_STYLES = "mini-plm-styles";


// Get all Styles
const getStylesPreview = async () => {
    const params = {
        TableName: TABLE_STYLES,
        AttributesToGet: ["StyleId", "StyleName", "Season", "Category", "DeliveryDate"]
    }

    const styles = await dynamoClient.scan(params).promise();
    return styles;
}


// Get a style by StyleId
const getStyleById = async (StyleId) => {
    const params = {
        TableName: TABLE_STYLES,
        Key: {
            StyleId
        }
    };

    return await dynamoClient.get(params).promise();
}


// Create new style
const addStyle = async (style) => {
    const params = {
        TableName: TABLE_STYLES,
        Item: style
    };

    return await dynamoClient.put(params).promise();
}


module.exports = {
    dynamoClient,
    getStylesPreview,
    getStyleById,
    addStyle
};