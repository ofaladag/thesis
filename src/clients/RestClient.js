import axios from 'axios';
import { storageKeys } from '../commons/Constants';

const instance = axios.create({
    baseURL: 'http://localhost:8090'
});

instance.interceptors.request.use(function (config) {
    config.headers.common["Consumer-ID"] =  localStorage.getItem(storageKeys.SURVEY_ID);

    return config;
});

export default instance;