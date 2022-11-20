import {legacy_createStore as createStore, combineReducers} from 'redux';

import {persistStore, persistReducer} from 'redux-persist';

import AsyncStorage from '@react-native-async-storage/async-storage';

import GeneralReducer from './reducers/GeneralReducer';

const rootReducer = combineReducers({
  generalReducer: GeneralReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['generalReducer'],
  blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer);

const persistor = persistStore(store);

export {store, persistor};
