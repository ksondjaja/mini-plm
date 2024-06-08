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

    console.log(id);
    console.log(info);

    const command = new PutCommand({
        TableName: TABLE_STYLES,
        Item: {
            "StyleId": id,
            "StyleInfo": info,
            "StyleSamples": [],
            "StyleSpecs": [],
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

    const command = new UpdateCommand({
        TableName: TABLE_STYLES,
        Key: {
            "StyleId": StyleId
        },
        UpdateExpression: "SET StyleSamples = list_append(StyleSamples, :newSample), StyleSpecs = :updatedStyleSpecs",
        ExpressionAttributeValues: {
            ":newSample": values.SampleInfo,
            ":updatedStyleSpecs": values.UpdatedStyleSpecs
        }
    })

    return await dynamoClient.send(command);
}

// Update Sample Info

// Delete a sample from an existing style -- NEED TO TEST
const deleteSampleById = async(values) => {

    const StyleId = parseInt(values.StyleId);

    const command = new UpdateCommand({
        TableName: TABLE_STYLES,
        Key: {
            "StyleId": StyleId
        },
        UpdateExpression: "DELETE StyleSamples[:sample]",
        ExpressionAttributeValues: {
            ":sample": values.SampleType
        },
        ReturnValues: "ALL_NEW"
    })

    return await dynamoClient.send(command);
}

const addSpecRow = async(values) => {

    const StyleId = parseInt(values.StyleId);
    // console.log(StyleId);
    // console.log(values.NewRow)

    const NewRowIndex = parseInt(values.NewRow.id)-1;
    // console.log(NewRowIndex);

    const command = new UpdateCommand({
        TableName: TABLE_STYLES,
        Key: {
            "StyleId": StyleId,
        },
        UpdateExpression: `SET StyleSpecs[${NewRowIndex}] = :NewRow`,
        ExpressionAttributeValues: {
            ":NewRow": values.NewRow
        }
    })

    return await dynamoClient.send(command);
}

// Update Spec every time a row/cell is updated
// Edit to fit new schema
const updateSpecRow = async(values) => {

    const StyleId = parseInt(values.StyleId);
    // console.log(StyleId);
    // console.log(values.UpdatedRow)
    const UpdatedRowIndex = parseInt(values.UpdatedRow.id)-1;
    console.log(UpdatedRowIndex);

    let expression;
    let attributeValues;

    if(values.UpdatedRow.pom){
        expression = `SET StyleSpecs[${UpdatedRowIndex}].pom = :UpdatedPOM, 
                    StyleSpecs[${UpdatedRowIndex}].code = :UpdatedCode, 
                    StyleSpecs[${UpdatedRowIndex}].init = :UpdatedInit`

        attributeValues = {
            ":UpdatedPOM": values.UpdatedRow.pom,
            ":UpdatedCode": values.UpdatedRow.code,
            ":UpdatedInit": values.UpdatedRow.init
        }
    }else{
        const SampleId = parseInt(values.UpdatedRow.SampleId)-1

        expression = `SET StyleSpecs[${UpdatedRowIndex}].samples[${SampleId}] = :UpdatedRow`
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
        ExpressionAttributeValues: attributeValues
    })

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
    deleteSampleById,
    addSpecRow,
    updateSpecRow
};