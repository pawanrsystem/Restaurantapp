import axios from 'axios';

// Create axios client, pre-configured with baseURL
let APIKit = axios.create({
    baseURL: ' https://reqres.in/api/',
    timeout: 10000,
});



export default APIKit;