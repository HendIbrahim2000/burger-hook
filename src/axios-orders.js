import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-builder-72e2b-default-rtdb.firebaseio.com/'
});

export default instance;