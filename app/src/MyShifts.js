import React, {Component} from 'react';

import {
  StyleSheet,
  StatusBar,
  SafeAreaView,
  FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
  BackHandler,
} from 'react-native';

import Toast from 'react-native-root-toast';

import {connect} from 'react-redux';

import moment from 'moment';

import {AndroidBackHandler} from 'react-navigation-backhandler';

import NetInfo from '@react-native-community/netinfo';

import {
  internet_availability,
  set_api_response,
} from '../store/actions/GeneralActions';

import {wp} from '../globals/helper/Responsive';

import {FontSizes} from '../globals/FontSizes';

import {Colors} from '../globals/Colors';

import {Images} from '../globals/Images';

import {Labels} from '../globals/Labels';

import LoaderView from '../globals/components/LoaderView';

import NoInternetView from '../globals/components/NoInternetView';

import ToastMessageConfig from '../globals/components/ToastMessageConfig';

import {axiosGet, axiosPost} from '../globals/helper/ApiHelper';

class MyShifts extends Component {
  constructor() {
    super();

    this.state = {
      is_loading: false,
      shift_list: [],
    };
  }

  componentDidMount() {
    NetInfo.addEventListener(state => {
      const connection =
        Platform.OS === 'ios' ? state.isConnected : state.isInternetReachable;
      //console.log(connection);
      this.props.internet_availability(connection);
    });

    this.getShifts();
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

  getShifts = async () => {
    this.setState({is_loading: true});

    await axiosGet('shifts')
      .then(response => {
        console.log('Get shifts API response', response);

        this.props.set_api_response(response);

        //  { '2022-11-19': [
        //       {
        //         id,
        //         booked,
        //         area,
        //         startTime,
        //         endTime,
        //         cancellable
        //       }
        //     ]
        //   }

        const groupData = response.reduce((shifts, item) => {
          const date = moment(new Date(item.startTime)).format('YYYY-MM-DD');

          // console.log(new Date(item.startTime).toString());

          if (!shifts[date]) {
            shifts[date] = [];
          }
          shifts[date].push({
            ...item,
            cancellable: new Date() > new Date(item.startTime) ? false : true,
          });
          return shifts;
        }, {});

        // console.log(groupData);

        // [
        //   {
        //     date: '2022-11-19',
        //     shifts: [
        //       {
        //         id,
        //         booked,
        //         area,
        //         startTime,
        //         endTime,
        //         cancellable
        //       }
        //     ]
        //   }
        // ]

        const groupArray = Object.keys(groupData).map(date => {
          return {
            date: date,
            shifts: groupData[date].sort(
              (a, b) => new Date(a.startTime) - new Date(b.startTime),
            ),
          };
        });

        // console.log(groupArray);

        this.setState({is_loading: false, shift_list: groupArray});
      })
      .catch(error => {
        console.log('Get shifts API error', error);
        Toast.show(Labels.SOMETHING_WENT_WRONG, ToastMessageConfig);
        this.setState({is_loading: false});
      });
  };

  cancelShiftFormData = shift => {
    const data = new FormData();

    data.append('id', shift.id);
    data.append('booked', shift.booked);
    data.append('area', shift.area);
    data.append('startTime', shift.startTime);
    data.append('endTime', shift.endTime);

    return data;
  };

  cancelShift = async shift => {
    this.setState({is_loading: true});

    await axiosPost(
      `shifts/${shift.id}/cancel`,
      this.cancelShiftFormData(shift),
    )
      .then(response => {
        console.log('Cancel shift API response', response);
        this.setState({is_loading: false});
        Toast.show(Labels.SHIFT_CANCELLED, ToastMessageConfig);
        // this.getShifts();
      })
      .catch(error => {
        console.log('Cancel shift API error', error);
        Toast.show(Labels.SOMETHING_WENT_WRONG, ToastMessageConfig);
        this.setState({is_loading: false});
      });
  };

  list = () => {
    return (
      <FlatList
        data={this.state.shift_list}
        keyExtractor={(data, i) => data.date.toString()}
        renderItem={({item, index}) => {
          let count = 0;
          let hours = 0;
          let date = '';

          const dt = new Date();
          dt.setDate(dt.getDate() + 1);

          if (item.date == moment(new Date()).format('YYYY-MM-DD')) {
            date = Labels.TODAY;
          } else if (item.date == moment(dt).format('YYYY-MM-DD')) {
            date = Labels.TOMORROW;
          } else {
            date = moment(item.date).format('MMMM DD');
          }

          item.shifts.map(sft => {
            if (sft.booked) {
              count += 1;
              hours =
                hours +
                Math.floor(sft.endTime - sft.startTime) / (60 * 60 * 1000);
            }
          });

          return (
            <View>
              <View style={styles.topViewStyle}>
                <Text style={styles.text1Style}>{date}</Text>
                <Text
                  style={[
                    styles.text3Style,
                    {
                      marginLeft: wp(15),
                    },
                  ]}>
                  {count} {Labels.SHIFTS}, {hours} {Labels.H}
                </Text>
              </View>
              {item.shifts.map((i, idx) => {
                if (i.booked) {
                  return (
                    <View key={i.id} style={styles.bottomViewStyle}>
                      <View>
                        <Text
                          style={[
                            styles.text2Style,
                            {
                              color: idx % 2 == 0 ? Colors.C7 : Colors.C10,
                            },
                          ]}>
                          {moment(new Date(i.startTime)).format('HH:mm')}-
                          {moment(new Date(i.endTime)).format('HH:mm')}
                        </Text>
                        <Text
                          style={[
                            styles.text3Style,
                            {
                              color: idx % 2 == 0 ? Colors.C7 : Colors.C10,
                            },
                          ]}>
                          {i.area}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => this.cancelShift(i)}
                        disabled={i.cancellable ? false : true}
                        style={[
                          styles.buttonViewStyle,
                          {
                            borderColor: i.cancellable ? Colors.C11 : Colors.C4,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.buttonTitleStyle,
                            {
                              color: i.cancellable ? Colors.C10 : Colors.C4,
                            },
                          ]}>
                          {Labels.CANCEL}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                }
              })}
            </View>
          );
        }}
      />
    );
  };

  render() {
    if (!this.props.is_internet_connection) {
      return (
        <NoInternetView
          show={!this.props.is_internet_connection ? true : false}
        />
      );
    }
    return (
      <AndroidBackHandler onBackPress={this.backAction}>
        <SafeAreaView style={styles.containerStyle}>
          <StatusBar
            animated={true}
            barStyle="light-content"
            backgroundColor={Colors.BLACK}
          />
          {this.state.is_loading ? <LoaderView /> : null}
          {this.list()}
        </SafeAreaView>
      </AndroidBackHandler>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: Colors.C6,
  },
  topViewStyle: {
    paddingVertical: wp(15),
    paddingHorizontal: wp(30),
    backgroundColor: Colors.C6,
    borderBottomWidth: wp(1),
    borderColor: Colors.C4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text1Style: {
    fontSize: FontSizes.Size13,
    color: Colors.C2,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  text2Style: {
    fontSize: FontSizes.Size14,
    color: Colors.C2,
    textAlign: 'left',
    fontWeight: 'normal',
  },
  text3Style: {
    fontSize: FontSizes.Size14,
    color: Colors.C4,
    textAlign: 'left',
    fontWeight: 'normal',
  },
  bottomViewStyle: {
    paddingVertical: wp(20),
    backgroundColor: Colors.WHITE,
    borderBottomWidth: wp(1),
    borderColor: Colors.C4,
    paddingHorizontal: wp(15),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonViewStyle: {
    height: wp(40),
    width: wp(100),
    borderRadius: wp(20),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  buttonTitleStyle: {
    fontSize: FontSizes.Size16,
    color: Colors.C4,
    textAlign: 'center',
    fontWeight: 'normal',
  },
});

const mapStateToProps = state => {
  return {
    is_internet_connection: state.generalReducer.is_internet_connection,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    internet_availability: x => dispatch(internet_availability(x)),
    set_api_response: x => dispatch(set_api_response(x)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyShifts);
