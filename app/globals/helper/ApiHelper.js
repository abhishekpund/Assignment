import axios from 'axios';

let baseUrl = 'http://192.168.1.7:8080/';
let instance = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
  },
});

const axiosGet = async url => {
  return instance
    .get(url)
    .then(response => {
      // console.log(response);
      response =
        typeof response.data === 'string'
          ? JSON.parse(response.data.trim())
          : response.data;

      return response;
    })
    .catch(error => {
      console.log('Axios Get Request Error => ', error);

      return error;
    });
};

const axiosParamsGet = async (url, data) => {
  console.log('Api url =>', url);
  console.log('Api Data=>', data);

  return instance
    .get(url, data)
    .then(response => {
      // console.log(response);
      response =
        typeof response.data === 'string'
          ? JSON.parse(response.data.trim())
          : response.data;

      return response;
    })
    .catch(error => {
      console.log('Axios Params Get Request Error => ', error);

      return error;
    });
};

const axiosPost = async (url, data) => {
  console.log('Api url =>', `${baseUrl}${url}`);
  console.log(`${url} Api Form Data=>`, data);

  return instance
    .post(url, data)
    .then(response => {
      console.log(response);
      response =
        typeof response.data === 'string'
          ? JSON.parse(response.data.trim())
          : response.data;
      return response;
    })
    .catch(error => {
      console.log('Axios Post Request Error => ', error);

      return error;
    });
};

export {axiosGet, axiosParamsGet, axiosPost};
