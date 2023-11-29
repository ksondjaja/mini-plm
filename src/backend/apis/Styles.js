//NOT BEING USED DUE TO PASSING TOKEN IN Home.js

import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export default axios.create({
    baseURL: BASE_URL,
    headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});