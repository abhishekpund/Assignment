import React from 'react';

import {View, Modal, StyleSheet, ActivityIndicator} from 'react-native';

import {Colors} from '../Colors';

const LoaderView = () => {
  return (
    <Modal
      onRequestClose={() => console.log('Loader Modal Closed')}
      statusBarTranslucent={true}
      transparent={true}
      visible={true}>
      <View style={styles.contentStyle}>
        <ActivityIndicator animating={true} color={Colors.BLACK} size="large" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  contentStyle: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.LOADER_BG,
  },
});

export default LoaderView;
