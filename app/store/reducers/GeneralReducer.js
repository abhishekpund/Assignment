import {INTERNET_AVAILABILITY, SET_API_RESPONSE} from '../types/Types';

const InitialState = {
  is_internet_connection: true,
  api_response: [],
};

const GeneralReducer = (state = InitialState, action) => {
  switch (action.type) {
    case INTERNET_AVAILABILITY:
      return {
        ...state,
        is_internet_connection: action.payload,
      };

    case SET_API_RESPONSE:
      return {
        ...state,
        api_response: action.payload,
      };

    default:
      return state;
  }
};

export default GeneralReducer;
