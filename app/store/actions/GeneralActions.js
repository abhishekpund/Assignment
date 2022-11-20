import {INTERNET_AVAILABILITY, SET_API_RESPONSE} from '../types/Types';

const internet_availability = data => {
  return {
    type: INTERNET_AVAILABILITY,
    payload: data,
  };
};

const set_api_response = data => {
  return {
    type: SET_API_RESPONSE,
    payload: data,
  };
};

export {internet_availability, set_api_response};
