// https://tapiwanashekanda.hashnode.dev/how-to-create-a-crud-api-using-expressjs-and-aws-dynamodb

const AWS = require('aws-sdk');

const { DynamoDBDocument,
    ScanCommand,
    UpdateCommand,
    PutCommand,
    GetCommand,
    DeleteCommand
 } = require("@aws-sdk/lib-dynamodb");

const { DynamoDB } = require("@aws-sdk/client-dynamodb");

const variables = require('dotenv').config({ path: '../../.env.local' });

console.log(variables);

// JS SDK v3 does not support global configuration.
// Codemod has attempted to pass values to each service client in this file.
// You may need to update clients outside of this file, if they use global config.
AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    endpoint: process.env.AWS_LOCAL_SERVER,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    s3ForcePathStyle: true
});

const dynamoClient = DynamoDBDocument.from(new DynamoDB());

const TABLE_STYLES = "mini-plm-styles";


// STUFF TO EDIT
// Save all info from Create Style inside StyleInfo attribute
// Generate a StyleID from Date.now(), also save it inside StyleInfo as StyleNumber
// Create a function to get only StyleInfo


// Get Styles to display in Home page
const getStylesPreview = async () => {
    const command = new ScanCommand({
        TableName: TABLE_STYLES,
        AttributesToGet: ["StyleId", "StyleInfo"]
    })

    const styles = await dynamoClient.send(command);
    return styles;
}

// Can also use ScanCommand to filter items based on attribute values


// Get general Style Info by StyleId
const getStyleById = async (styleid) => {

    const StyleId = parseInt(styleid);

    const command = new GetCommand({
        TableName: TABLE_STYLES,
        Key: {
            "StyleId": StyleId
        }
    });

    console.log(command);

    return await dynamoClient.send(command);
}


// Create new style - debug PutItemCommand undefined error
const addStyle = async (style) => {

    const id = parseInt(style.StyleId);
    const info = style.StyleInfo;

    console.log(id);
    console.log(info);

    const command = new PutCommand({
        TableName: TABLE_STYLES,
        Item: {
            "StyleId": id,
            "StyleInfo": info
        }
    });

    console.log(command);

    return await dynamoClient.send(command);
}

//Update general Style Info
const editInfo = async(values) => {

    const command = new UpdateCommand({
        TableName: TABLE_STYLES,
        Key: {
            "StyleId": values.StyleId
        },
        UpdateExpression: "SET StyleInfo = :StyleInfo",
        ExpressionAttributeValues: {
            ":StyleInfo": values.StyleInfo
        }
    })

    return await dynamoClient.send(command);
}


// Delete a style by ID
const deleteStyleById = async (styleid) => {

    const StyleId = parseInt(styleid);

    const command = new DeleteCommand({
        TableName: TABLE_STYLES,
        Key: {
            "StyleId": StyleId
        }
    });

    return await dynamoClient.send(command);
}


// Create new Work Order/Sample for a style
// Edit a single attribute in a Style. But put an entire chart object (Hashmap?) of specs/BOM for the attribute.
// HOW TO EDIT/ADD/REMOVE A SPECIFIC WORK ORDER? MAYBE NEED A SEPARATE METHOD FOR EACH

const addWorkOrder = async(values) => {

    const params = new UpdateCommand({
        TableName: TABLE_STYLES,
        Key: {
            "StyleId": values.StyleId
        },
        UpdateExpression: "SET StyleWorkOrder = :StyleWorkOrder",
        ExpressionAttributeValues: {
            ":StyleWorkOrder": values.StyleInfo
        }
    })

    return await dynamoClient.send(params);
}


module.exports = {
    dynamoClient,
    getStylesPreview,
    getStyleById,
    addStyle,
    editInfo,
    addWorkOrder,
    deleteStyleById
};