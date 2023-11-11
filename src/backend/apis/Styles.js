// use API with Axios tutorial: https://www.youtube.com/watch?v=NqdqnfzOQFE&ab_channel=DaveGray

// LOCAL JSON SERVER FOR TESTING tutorial: https://www.youtube.com/watch?v=_j3yiadVGQA&ab_channel=CodeWithYousaf
// COMMAND TO RUN LOCAL SERVER: npx json-server --watch db.json --port 3001

import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export default axios.create({
    baseURL: BASE_URL,
    headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});