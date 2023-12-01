//https://www.youtube.com/watch?v=Jfkme6WE_Dk&ab_channel=DailyWebCoding

const express = require('express');
const cors = require('cors');

const db = require('../../db.json');

const app = express();
const port = 8000;

app.use(cors());

app.get('/api/styles', (req, res)=>{
    return res.json(db);
})

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`)
})