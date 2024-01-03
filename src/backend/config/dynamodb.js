// https://tapiwanashekanda.hashnode.dev/how-to-create-a-crud-api-using-expressjs-and-aws-dynamodb

const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'AKIAZEXWPZKVZTVHNWYQ',
    secretAccessKey: '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'
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();

const TABLE_STYLES = "mini-plm-styles";


// Get all Styles
const getStyles = async () => {
    const params = {
        TableName: TABLE_STYLES
    }

    const styles = await dynamoClient.scan(params).promise();
    console.log(styles);
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
    getStyles,
    getStyleById,
    addStyle
};