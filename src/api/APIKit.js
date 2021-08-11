import axios from 'axios';
import * as AxiosLogger from 'axios-logger';

// Create axios client, pre-configured with baseURL
const APIKit = axios.create({
  baseURL: ' https://reqres.in/api/',
  timeout: 10000,
});
APIKit.interceptors.request.use(AxiosLogger.requestLogger);
APIKit.interceptors.response.use(
  AxiosLogger.responseLogger,
  AxiosLogger.errorLogger,
);

export default APIKit;
