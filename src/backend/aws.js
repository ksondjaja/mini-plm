// https://tapiwanashekanda.hashnode.dev/how-to-create-a-crud-api-using-expressjs-and-aws-dynamodb
// https://www.youtube.com/watch?v=_DRklnnJbig&ab_channel=WebDevCody

const AWS = require('aws-sdk');

const variables = require('dotenv').config({ path: '../../.env.local' });

//console.log(variables);

const config = {
    region: process.env.AWS_DEFAULT_REGION,
    endpoint: process.env.AWS_BUCKET_URL,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    signatureVersion: 'v2'
}

// JS SDK v3 does not support global configuration.
// Codemod has attempted to pass values to each service client in this file.
// You may need to update clients outside of this file, if they use global config.
AWS.config.update(config);


// Set up DynamoDB
const { DynamoDBDocument,
    ScanCommand,
    UpdateCommand,
    PutCommand,
    GetCommand,
    DeleteCommand
 } = require("@aws-sdk/lib-dynamodb");

const { DynamoDB } = require("@aws-sdk/client-dynamodb");

const dynamoClient = DynamoDBDocument.from(new DynamoDB());
const TABLE_STYLES = "mini-plm-styles";



// Set up S3
const { S3Client,
    PutObjectCommand,
    GetObjectCommand
} = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const BUCKET = process.env.AWS_BUCKET_NAME

const s3 = new S3Client(config);




// --------- S3 METHODS ---------

// Get signed URL to view images from S3 Bucket
const getImageSignedURL = async (params) => {

    const extension = params.split('.')[1];
    //console.log(extension);

    const command = new GetObjectCommand({
        Bucket: BUCKET,
        Key: params,
        Expires: 60 * 60,
        ContentType: `image/${extension}`
    });

    const url = await getSignedUrl(s3, command, {expiresIn: 3600})

    return url;

}
// Get image from S3 Bucket
const getFile = async (params) => {
    const command = new GetObjectCommand({
        Bucket: BUCKET,
        Key: params
    });

    try{
        const response = await s3.send(command);
        return response;
    }catch(err){
        console.log("Error: "+JSON.stringify(err));
    }
}

// Upload image to S3 bucket through Signed URL
const uploadFile = async (params) => {

    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: params.imageName,
        Body: params.imageFile,
        ContentType: params.contentType,
        ContentLength: params.contentLength
    })

    try{
        const response = await s3.send(command);
        return response;

    }catch(err){
        console.log("Error: "+JSON.stringify(err));
    }

}


// --------- DYNAMODB METHODS ---------

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
    const grading = style.StyleGrading;
    const images = style.StyleImages

    console.log(id);
    console.log(info);

    const command = new PutCommand({
        TableName: TABLE_STYLES,
        Item: {
            "StyleId": id,
            "StyleInfo": info,
            "StyleSamples": samples,
            "StyleSpecs": specs,
            "StyleGrading": grading,
            "StyleImages": images
        }
    });

    console.log(command);

    return await dynamoClient.send(command);
}

// Update general Style Info
const editStyle = async(values) => {

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

// Add info of style images when uploaded
const addImageInfo = async(values) => {

    const StyleId = parseInt(values.StyleId);

    const command = new UpdateCommand({
        TableName: TABLE_STYLES,
        Key: {
            "StyleId": StyleId,
        },
        UpdateExpression: `SET StyleImages.#ImageId= :NewImage`,
        ExpressionAttributeNames: {
            "#ImageId" : values.ImageId
        },
        ExpressionAttributeValues: {
            ":NewImage": values.ImageInfo
        }
    })

    return await dynamoClient.send(command);
}

// Add new row of Spec for all samples
const addSpecRow = async(values) => {

    const StyleId = parseInt(values.StyleId);

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
    getImageSignedURL,
    getFile,
    uploadFile,
    getStylesPreview,
    getStyleById,
    addStyle,
    editStyle,
    deleteStyleById,
    addImageInfo,
    addSampleById,
    updateSampleById,
    deleteSampleById,
    addSpecRow,
    updateSpecRow,
    deleteSpecRow
};