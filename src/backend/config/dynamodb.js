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
const { ConstructionOutlined } = require('@mui/icons-material');

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


// TO-DO LIST
// Create method to save Work Orders/Sample status
// Create method to save Sample Specs


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


// Get any style attributes by Style Id (i.e. enter wanted item under Attributes)
// This include Sample info or any nested attribute

const getStyleById = async (style) => {

    const StyleAttributes = style.Attributes;
    const StyleId = parseInt(style.StyleId);

    //console.log(StyleAttributes);

    const command = new GetCommand({
        TableName: TABLE_STYLES,
        Key: {
            "StyleId": StyleId
        },
        ProjectionExpression: StyleAttributes
    });

    console.log(command);

    return await dynamoClient.send(command);
}


// Create new style - debug PutItemCommand undefined error
const addStyle = async (style) => {

    const id = parseInt(style.StyleId);
    const info = style.StyleInfo;
    const samples = style.StyleSamples;
    const specs = style.StyleSpecs;

    console.log(id);
    console.log(info);

    const command = new PutCommand({
        TableName: TABLE_STYLES,
        Item: {
            "StyleId": id,
            "StyleInfo": info,
            "StyleSamples": samples,
            "StyleSpecs": specs,
            "StyleGrading": null,
            "StyleImages": null
        }
    });

    console.log(command);

    return await dynamoClient.send(command);
}

// Update general Style Info
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

// Create a new Sample/Work Order for an existing style
const addSampleById = async(values) => {

    const StyleId = parseInt(values.StyleId);
    const SampleId = values.SampleInfo.id;

    const command = new UpdateCommand({
        TableName: TABLE_STYLES,
        Key: {
            "StyleId": StyleId
        },
        UpdateExpression: "SET StyleSamples.#SampleId = :newSample, StyleSpecs = :newSpecs",
        ExpressionAttributeNames: {
            "#SampleId": SampleId
        },
        ExpressionAttributeValues: {
            ":newSample": values.SampleInfo,
            ":newSpecs": values.UpdatedStyleSpecs
        }
    })

    return await dynamoClient.send(command);
}

// Update Sample Info

const updateSampleById = async(values) => {

    const StyleId = parseInt(values.StyleId);

    console.log(JSON.stringify(values));

    const command = new UpdateCommand({
        TableName: TABLE_STYLES,
        Key: {
            "StyleId": StyleId
        },
        UpdateExpression: "SET StyleSamples.#SampleId = :updatedSample",
        ExpressionAttributeNames: {
            "#SampleId": values.SampleId
        },
        ExpressionAttributeValues: {
            ":updatedSample": values.SampleInfo
        }
    })

    return await dynamoClient.send(command);
}

// Delete a sample from an existing style
const deleteSampleById = async(values) => {

    const StyleId = parseInt(values.StyleId);

    const command = new UpdateCommand({
        TableName: TABLE_STYLES,
        Key: {
            "StyleId": StyleId
        },
        UpdateExpression: "REMOVE StyleSamples.#SampleId",
        ExpressionAttributeNames: {
            "#SampleId": values.SampleId
        }
    })

    return await dynamoClient.send(command);
}

// Add new row of Spec for all samples
const addSpecRow = async(values) => {

    const StyleId = parseInt(values.StyleId);
    // console.log(StyleId);
    // console.log(values.NewRow)

    const command = new UpdateCommand({
        TableName: TABLE_STYLES,
        Key: {
            "StyleId": StyleId,
        },
        UpdateExpression: `SET StyleSpecs.#RowId = :NewRow`,
        ExpressionAttributeNames: {
            "#RowId" : values.NewRow.POMId
        },
        ExpressionAttributeValues: {
            ":NewRow": values.NewRow
        }
    })

    return await dynamoClient.send(command);
}

// Update Spec every time a row/cell is updated
const updateSpecRow = async(values) => {

    const StyleId = parseInt(values.StyleId);
    // console.log(StyleId);
    // console.log(values.UpdatedRow)

    let expression;
    let attributeNames;
    let attributeValues;

    if(values.UpdatedRow.pom){
        expression = `SET StyleSpecs.#RowKey.pom = :UpdatedPOM, 
                    StyleSpecs.#RowKey.code = :UpdatedCode, 
                    StyleSpecs.#RowKey.init = :UpdatedInit`

        attributeNames = {
            "#RowKey" : values.UpdatedRow.POMId
        }

        attributeValues = {
            ":UpdatedPOM": values.UpdatedRow.pom,
            ":UpdatedCode": values.UpdatedRow.code,
            ":UpdatedInit": values.UpdatedRow.init
        }
    }else{
        expression = `SET StyleSpecs.#RowKey.samples.#SampleKey = :UpdatedRow`

        attributeNames = {
            "#RowKey" : values.UpdatedRow.POMId,
            "#SampleKey": values.UpdatedRow.SampleId
        }

        attributeValues = {
            ":UpdatedRow": values.UpdatedRow
        }
    }

    const command = new UpdateCommand({
        TableName: TABLE_STYLES,
        Key: {
            "StyleId": StyleId,
        },
        UpdateExpression: expression,
        ExpressionAttributeNames: attributeNames,
        ExpressionAttributeValues: attributeValues
    })

    return await dynamoClient.send(command);
}


// Delete a row of Spec for all samples
const deleteSpecRow = async(values) => {

    const StyleId = parseInt(values.StyleId);
    // console.log(StyleId);

    const command = new UpdateCommand({
        TableName: TABLE_STYLES,
        Key: {
            "StyleId": StyleId,
        },
        UpdateExpression: `REMOVE StyleSpecs.#RowId`,
        ExpressionAttributeNames: {
            "#RowId": values.RowId
        }
    })

    // How to assign new id for all rows

    return await dynamoClient.send(command);
}



module.exports = {
    dynamoClient,
    getStylesPreview,
    getStyleById,
    addStyle,
    editInfo,
    deleteStyleById,
    addSampleById,
    updateSampleById,
    deleteSampleById,
    addSpecRow,
    updateSpecRow,
    deleteSpecRow
};