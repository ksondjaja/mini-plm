// https://tapiwanashekanda.hashnode.dev/how-to-create-a-crud-api-using-expressjs-and-aws-dynamodb

const express = require('express');

const { getStylesPreview, getStyleById, addStyle } = require('../config/dynamodb');

const router = express.Router();

router.use(express.json())


// api endpoint to get all Styles
router.get('/', async (req, res) => {
    try {
        const styles = await getStylesPreview();
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
        console.log(newStyle);
        res.json(newStyle);
    } catch (err) {
        console.error(err);
        res.status(500).json({err: `Something went wrong`});
    }
})


module.exports = router;