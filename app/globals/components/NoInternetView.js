import React, {Component} from 'react';

import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Alert,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';

import Modal from 'react-native-modal';

import {AndroidBackHandler} from 'react-navigation-backhandler';

import {wp} from '../helper/Responsive';

import {FontSizes} from '../FontSizes';

import {Colors} from '../Colors';

import {Labels} from '../Labels';

const {width, height} = Dimensions.get('screen');

class NoInternetView extends Component {
  constructor() {
    super();

    this.state = {};
  }

  backAction = () => {
    Alert.alert(Labels.APP_NAME, Labels.ARE_YOU_SURE_WANT_TO_EXIT, [
      {
        text: Labels.NO,
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: Labels.YES,
        onPress: () => {
          BackHandler.exitApp();
        },
      },
    ]);
    return true;
  };

  render() {
    const {show} = this.props;
    return (
      <AndroidBackHandler onBackPress={this.backAction}>
        <Modal
          isVisible={show}
          style={styles.modalStyle}
          coverScreen
          backdropColor={Colors.WHITE}
          statusBarTranslucent={true}
          deviceHeight={height}
          deviceWidth={width}
          onBackButtonPress={() => this.backAction()}>
          <View style={styles.viewStyle}>
            <StatusBar
              hidden={false}
              animated={true}
              barStyle="dark-content"
              backgroundColor={Colors.WHITE}
            />
            <Text style={styles.infoStyle}>
              {Labels.PLEASE_CHECK_YOUR_INTERNET_CONNECTION}
            </Text>
          </View>
        </Modal>
      </AndroidBackHandler>
    );
  }
}

const styles = StyleSheet.create({
  modalStyle: {
    margin: 0,
    flex: 1,
    backgroundColor: Colors.MODAL_BG,
  },
  viewStyle: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoStyle: {
    fontSize: FontSizes.Size16,
    fontWeight: 'bold',
    color: Colors.BLACK,
    textAlign: 'center',
    marginHorizontal: wp(16),
  },
});

export default NoInternetView;
