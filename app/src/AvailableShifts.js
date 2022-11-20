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
} from 'react-native';

import Toast from 'react-native-root-toast';

import {connect} from 'react-redux';

import moment from 'moment';

import {AndroidBackHandler} from 'react-navigation-backhandler';

import {wp} from '../globals/helper/Responsive';

import {FontSizes} from '../globals/FontSizes';

import {Colors} from '../globals/Colors';

import {Images} from '../globals/Images';

import {Labels} from '../globals/Labels';

import {Constants} from '../globals/Constants';

import LoaderView from '../globals/components/LoaderView';

import ToastMessageConfig from '../globals/components/ToastMessageConfig';

import {axiosGet, axiosPost} from '../globals/helper/ApiHelper';

class AvailableShifts extends Component {
  constructor() {
    super();

    this.state = {
      is_loading: false,

      helsinki: [],
      tampere: [],
      turku: [],

      helsinki_shifts: [],
      tampere_shifts: [],
      turku_shifts: [],

      show_helsinki: true,
      show_tampere: false,
      show_turku: false,
    };
  }

  componentDidMount() {
    this.filterData();
  }

  backAction = () => {
    this.props.navigation.goBack();

    return true;
  };

  filterData = () => {
    const l1 = this.props.api_response.filter(
      item => item.area == Constants.HELSINKI,
    );

    const l2 = this.props.api_response.filter(
      item => item.area == Constants.TAMPERE,
    );

    const l3 = this.props.api_response.filter(
      item => item.area == Constants.TURKU,
    );

    // console.log(l1, l2, l3);

    this.setState(
      {
        helsinki: l1,
        tampere: l2,
        turku: l3,
      },
      () => {
        this.sortHelsinkiData();
        this.sortTampereData();
        this.sortTurkuData();
      },
    );
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

  bookShiftFormData = shift => {
    const data = new FormData();

    data.append('id', shift.id);
    data.append('booked', shift.booked);
    data.append('area', shift.area);
    data.append('startTime', shift.startTime);
    data.append('endTime', shift.endTime);

    return data;
  };

  bookShift = async shift => {
    this.setState({is_loading: true});

    await axiosPost(`shifts/${shift.id}/book`, this.bookShiftFormData(shift))
      .then(response => {
        console.log('Book shift API response', response);
        this.setState({is_loading: false});
        Toast.show(Labels.SHIFT_BOOKED, ToastMessageConfig);
        // this.getShifts();
      })
      .catch(error => {
        console.log('Book shift API error', error);
        Toast.show(Labels.SOMETHING_WENT_WRONG, ToastMessageConfig);
        this.setState({is_loading: false});
      });
  };

  sortHelsinkiData = () => {
    const groupData = this.state.helsinki.reduce((shifts, item) => {
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

    const groupArray = Object.keys(groupData).map(date => {
      return {
        date: date,
        shifts: groupData[date].sort(
          (a, b) => new Date(a.startTime) - new Date(b.startTime),
        ),
      };
    });

    console.log(groupArray);

    this.setState({helsinki_shifts: groupArray});
  };

  sortTampereData = () => {
    const groupData = this.state.tampere.reduce((shifts, item) => {
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

    const groupArray = Object.keys(groupData).map(date => {
      return {
        date: date,
        shifts: groupData[date].sort(
          (a, b) => new Date(a.startTime) - new Date(b.startTime),
        ),
      };
    });

    console.log(groupArray);

    this.setState({tampere_shifts: groupArray});
  };

  sortTurkuData = () => {
    const groupData = this.state.turku.reduce((shifts, item) => {
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

    const groupArray = Object.keys(groupData).map(date => {
      return {
        date: date,
        shifts: groupData[date].sort(
          (a, b) => new Date(a.startTime) - new Date(b.startTime),
        ),
      };
    });

    console.log(groupArray);

    this.setState({turku_shifts: groupArray});
  };

  topView = () => {
    return (
      <View style={styles.topViewStyle}>
        <TouchableOpacity
          onPress={() => {
            this.setState({
              show_helsinki: true,
              show_tampere: false,
              show_turku: false,
            });
          }}>
          <Text
            style={[
              {color: this.state.show_helsinki ? Colors.C1 : Colors.C4},
              styles.headerTextStyle,
            ]}>
            {Labels.HELSINKI} ({this.state.helsinki.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.setState({
              show_helsinki: false,
              show_tampere: true,
              show_turku: false,
            });
          }}>
          <Text
            style={[
              {color: this.state.show_tampere ? Colors.C1 : Colors.C4},
              styles.headerTextStyle,
            ]}>
            {Labels.TAMPERE} ({this.state.tampere.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.setState({
              show_helsinki: false,
              show_tampere: false,
              show_turku: true,
            });
          }}>
          <Text
            style={[
              {color: this.state.show_turku ? Colors.C1 : Colors.C4},
              styles.headerTextStyle,
            ]}>
            {Labels.TURKU} ({this.state.turku.length})
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  list = () => {
    return (
      <FlatList
        data={
          this.state.show_helsinki
            ? this.state.helsinki_shifts
            : this.state.show_tampere
            ? this.state.tampere_shifts
            : this.state.turku_shifts
        }
        keyExtractor={(data, i) => data.date.toString()}
        renderItem={({item, index}) => {
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

          return (
            <View>
              <View style={styles.dayViewStyle}>
                <Text style={styles.text1Style}>{date}</Text>
              </View>
              {item.shifts.map(i => {
                return (
                  <View key={i.id} style={styles.bottomViewStyle}>
                    <Text style={styles.text2Style}>
                      {moment(new Date(i.startTime)).format('HH:mm')}-
                      {moment(new Date(i.endTime)).format('HH:mm')}
                    </Text>
                    <Text style={styles.text1Style}>
                      {i.booked ? Labels.BOOKED : ''}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        if (i.booked) {
                          this.cancelShift(i);
                        } else {
                          this.bookShift(i);
                        }
                      }}
                      disabled={i.cancellable ? false : true}
                      style={[
                        styles.buttonViewStyle,
                        {
                          borderColor: i.cancellable
                            ? i.booked
                              ? Colors.C10
                              : Colors.C7
                            : Colors.C4,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.buttonTitleStyle,
                          {
                            color: i.cancellable
                              ? i.booked
                                ? Colors.C10
                                : Colors.C7
                              : Colors.C4,
                          },
                        ]}>
                        {i.booked ? Labels.CANCEL : Labels.BOOK}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          );
        }}
      />
    );
  };

  render() {
    return (
      <AndroidBackHandler onBackPress={this.backAction}>
        <SafeAreaView style={styles.container}>
          <StatusBar
            animated={true}
            barStyle="light-content"
            backgroundColor={Colors.BLACK}
          />
          {this.state.is_loading ? <LoaderView /> : null}
          {this.topView()}
          {this.list()}
        </SafeAreaView>
      </AndroidBackHandler>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  topViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(20),
    paddingVertical: wp(20),
    borderBottomWidth: wp(1),
    borderColor: Colors.C4,
  },
  headerTextStyle: {
    fontSize: FontSizes.Size17,
  },
  dayViewStyle: {
    paddingVertical: wp(15),
    paddingHorizontal: wp(30),
    backgroundColor: Colors.C6,
    borderBottomWidth: wp(1),
    borderColor: Colors.C4,
    alignItems: 'flex-start',
  },
  text1Style: {
    fontSize: FontSizes.Size15,
    color: Colors.C2,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  text2Style: {
    fontSize: FontSizes.Size16,
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
    textAlign: 'center',
    fontWeight: 'normal',
  },
});

const mapStateToProps = state => {
  return {
    is_internet_connection: state.generalReducer.is_internet_connection,
    api_response: state.generalReducer.api_response,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AvailableShifts);
