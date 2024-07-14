// https://tapiwanashekanda.hashnode.dev/how-to-create-a-crud-api-using-expressjs-and-aws-dynamodb

const express = require('express');

const { 
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
} = require('../aws');

const router = express.Router();

router.use(express.json())

// Get image signed URL to view from S3 Bucket
router.get('/viewImages', async (req,res) => {

    const imageNames = req.query.images;

    console.log("images: "+JSON.stringify(imageNames))
    
    let images = []

    for(let i=0; i<imageNames.length; i++){
        try{
            const image = await getImageSignedURL(imageNames[i]);
            const imageURL = Buffer.from(image, 'utf-8').toString()
            images.push(imageURL);
        } catch(err){
            console.error(err);
            res.status(500).json({err: `Something went wrong`});
        }
    }

    res.json(images);
})

// Get images to download from S3 Bucket
router.get('/getFiles', async (req,res) => {

    const imageNames = req.body
    
    // On Frontend can change to enable downloading file only one-by-one, or as 1 zipped file
    let images = []

    for(let i=0; i<imageNames.length; i++){
        try{
            const image = await getFile(imageNames[i]);
            images.push(image);
        } catch(err){
            console.error(err);
            res.status(500).json({err: `Something went wrong`});
        }
    }

    res.json(images);
})

// Upload image to S3 Bucket
router.post('/uploadFile', async (req,res) => {

    try{
        const uploadedFile = await uploadFile(req);
        res.json(uploadedFile);
        console.log('uploaded')
    } catch(err){
        console.error(err);
        res.status(500).json({err: `Something went wrong`});
    }

})


// api endpoint to get all Styles
router.get('/', async (req, res) => {
    try {
        const styles = await getStylesPreview();

        console.log(styles);

        res.json(styles);
    } catch (err) {
        console.error(err);
        res.status(500).json({err: `Something went wrong`});
    }
})


// api endpoint to get any Style's attributes by StyleId

router.get('/:id', async (req, res) => {
    
    const Style = req.query.attributes;
    console.log(Style);

    try {
        const style = await getStyleById(Style);
        console.log(style);
        res.json(style);
    } catch (err) {
        console.error(err);
        res.status(500).json({err: `Something went wrong`});
    }
})

// router.get('/:id', async (req, res) => {
    
//     const Style = req.body

//     try {
//         const style = await getStyleById(Style);
//         console.log(style);
//         res.json(style);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({err: `Something went wrong`});
//     }
// })


// api endpoint to add new Style
router.post('/add', async (req, res) => {

    const style = req.body;

    try {
        const newStyle = await addStyle(style);
        
        res.json(newStyle);

        console.log(newStyle);
    } catch (err) {
        console.error(err);
        res.status(500).json({err: `Something went wrong`});
    }
})


// Update Style Info by Id (replaces exsting entry with newer version of info)
router.post('/update/:id', async(req, res) => {

    const style = req.body;

    try {
        const updatedStyle = await editStyle(style);
        res.json(updatedStyle);
        console.log(updatedStyle);
    } catch (err) {
        console.error(err);
        res.status(500).json({err: `Something went wrong`});
    }

})

// Delete a style by Style Id
router.delete('/delete/:id', async (req, res) => {

    const StyleId = req.params.id;

    try {
        const style = await deleteStyleById(StyleId);

        res.json(style);

        console.log('Deleted: '+ StyleId)
    } catch (err) {
        console.error(err);
        res.status(500).json({err: `Something went wrong`});
    }
})

router.post('/addImageInfo', async (req,res) =>{

    const imageInfo = req.body;

    try{
        const newImageInfo = await addImageInfo(imageInfo);
        res.json(newImageInfo)
    }catch(err){
        console.error(err);
        res.status(500).json({err: `Something went wrong`});
    }

})

// Add new Sample by Style Id
router.post('/addSample', async (req, res) => {

    const sample = req.body;

    try {
        const newSample = await addSampleById(sample);
        res.json(newSample);
    } catch (err) {
        console.error(err);
        res.status(500).json({err: `Something went wrong`});
    }
})

// Update a Sample by Style Id
router.post('/updateSample', async (req, res) => {

    const sample = req.body;

    try {
        const updatedSample = await updateSampleById(sample);
        res.json(updatedSample);
    } catch (err) {
        console.error(err);
        res.status(500).json({err: `Something went wrong`});
    }
})

// Delete a sample by Style Id

router.post('/deleteSample', async (req, res) => {

    const row = req.body;
    console.log(row);

    try {
        const deletedSample = await deleteSampleById(row);        
        res.json(deletedSample);

        console.log(deletedSample);
    } catch (err) {
        console.error(err);
        res.status(500).json({err: `Something went wrong`});
    }
})

// Add a row of Style's specs
router.post('/addSpecRow', async (req, res) => {

    const row = req.body;
    console.log(row);

    try {
        const newRow = await addSpecRow(row);        
        res.json(newRow);

        console.log(newRow);
    } catch (err) {
        console.error(err);
        res.status(500).json({err: `Something went wrong`});
    }
})

// Update a row of Style's specs
router.post('/updateSpecRow', async (req, res) => {

    const row = req.body;
    console.log(row);

    try {
        const updatedRow = await updateSpecRow(row);        
        res.json(updatedRow);

        console.log(updatedRow);
    } catch (err) {
        console.error(err);
        res.status(500).json({err: `Something went wrong`});
    }
})

// Delete a row of a Style's specs
router.post('/deleteSpecRow', async (req, res) => {

    const row = req.body;
    console.log(row);

    try {
        const deletedRow = await deleteSpecRow(row);        
        res.json(deletedRow);

        console.log(deletedRow);
    } catch (err) {
        console.error(err);
        res.status(500).json({err: `Something went wrong`});
    }
})


module.exports = router;