//https://www.youtube.com/watch?v=Jfkme6WE_Dk&ab_channel=DailyWebCoding

const express = require('express');
const cors = require('cors');
const middleware = require('../middleware');

const db = require('../../db.json');

const app = express();
const port = 8000;

app.use(cors());

app.use(middleware.decodeToken);

app.get('/api/', (req, res)=>{
    console.log('LOAD DB');
    
    return res.json(db);
})

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`)
})