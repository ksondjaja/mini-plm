//https://www.youtube.com/watch?v=Jfkme6WE_Dk&ab_channel=DailyWebCoding

//DECIDE WHERE TO PUT DATABASE TO FIGURE OUT HOW TO DO app.post()


const express = require('express');
const cors = require('cors');
const middleware = require('../middleware');
const router = require('./apis/styles')

// Local JSON file DB
// const db = require('../../db.json');

const app = express();
const port = 8000;

app.use(cors());

app.use(middleware.decodeToken);

app.use(express.json());

app.use('/api/styles', router);


// Get from local JSON file DB
// app.get('/api/', (req, res)=>{
//     console.log('LOAD DB');
    
//     return res.json(db);
// })

// app.post('/api/', (req, res)=>{

// })

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`)
})