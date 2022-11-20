import React from 'react';

import {StyleSheet, Text, View} from 'react-native';

import {SafeAreaProvider} from 'react-native-safe-area-context';

import {Provider} from 'react-redux';

import {PersistGate} from 'redux-persist/integration/react';

import {store, persistor} from './app/store/Store';

import Navigator from './app/src/Navigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Navigator />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
