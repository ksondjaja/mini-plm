// https://tapiwanashekanda.hashnode.dev/how-to-create-a-crud-api-using-expressjs-and-aws-dynamodb

const express = require('express');

const { 
    getStylesPreview,
    getStyleById,
    addStyle,
    editAttribute,
    deleteStyleById
} = require('../config/dynamodb');

const router = express.Router();

router.use(express.json())


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


// api endpoint to get Style by StyleId
router.get('/:id', async (req, res) => {
    
    const StyleId = parseInt(req.params.id);

    try {
        const style = await getStyleById(StyleId);
        res.json(style);
    } catch (err) {
        console.error(err);
        res.status(500).json({err: `Something went wrong`});
    }
})


// api endpoint to post/add new Style
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

//Edit a single attribute of Style by Id
router.put('/edit/:id/:attribute', async(req, res) =>{
    const StyleId = parseInt(req.params.id);
    const attribute = req.params.attribute
    const newValue = req.body

    try {
        const editedAttribute = await editAttribute(StyleId, attribute, newValue);
        res.json(editedAttribute);
    } catch (err) {
        console.error(err);
        res.status(500).json({err: `Something went wrong`});
    }
})

// Update a lot of attributes in a Style by Id (replaces exsting entry with newer version of info)
router.put('/update/:id', async(req, res) => {

    const StyleId = parseInt(req.params.id);
    const style = req.body;

    style.id = StyleId;

    try {
        const updatedStyle = await addStyle(style);
        res.json(updatedStyle);
    } catch (err) {
        console.error(err);
        res.status(500).json({err: `Something went wrong`});
    }

})

router.delete('/delete/:id', async (req, res) => {
    const StyleId = parseInt(req.params.id);

    try {
        const style = await deleteStyleById(StyleId);

        res.json(style);

        console.log('Deleted: '+ StyleId)
    } catch (err) {
        console.error(err);
        res.status(500).json({err: `Something went wrong`});
    }
})


module.exports = router;