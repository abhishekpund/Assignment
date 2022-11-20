import React from 'react';

import {StyleSheet, Text, View} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/Ionicons';

import MyShifts from './MyShifts';

import AvailableShifts from './AvailableShifts';

const Tab = createBottomTabNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="MyShifts"
          component={MyShifts}
          options={{
            headerShown: false,
            tabBarLabel: ({focused, size, color}) => (
              <Text style={{
                color,
                fontSize: size
              }}>My Shifts</Text>
            ),
            tabBarIcon: ({focused, size, color}) => (
              <Icon name="bookmark-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="AvailableShifts"
          component={AvailableShifts}
          options={{
            headerShown: false,
            tabBarLabel: ({focused, size, color}) => (
              <Text style={{
                color,
                fontSize: size
              }}>Available Shifts</Text>
            ),
            tabBarIcon: ({focused, size, color}) => (
              <Icon name="list" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
