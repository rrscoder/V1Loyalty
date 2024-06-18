import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import LocalStore from '../pages/Store/LocalStore';
import FavouriteStore from '../pages/Store/FavouriteStore';
import Purchases from '../pages/Account/Purchases';
import RewardEarned from '../pages/Account/RewardEarned';

const TabNavigation = ({navigation, route}) => {
  const Tab = createMaterialTopTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={({route, navigation}) => ({
        tabBarLabelStyle: {fontSize: 15},
        tabBarStyle: {
          elevation: 0,
          borderRadius: 10,
          marginVertical: 10,
          marginHorizontal: 20,
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#F6A917',
        tabBarIndicatorStyle: {
          backgroundColor: '#F6A917',
          height: "100%",
          borderRadius:10
        },
      })}
      style={{backgroundColor: '#5387C6'}}
      >
      {route?.name === 'Stores' ? (
        <>
          <Tab.Screen
            name="LocalStore"
            component={LocalStore}
            options={{
              title: 'Local Stores',
            }}
          />
          <Tab.Screen
            name="FavouriteStore"
            component={FavouriteStore}
            options={{
              title: 'Favourites',
            }}
          />
        </>
      ) : route?.name === 'TransactionActivity' ? (
        <>
          <Tab.Screen
            name="Purchases"
            component={Purchases}
            options={{
              title: 'Purchases',
            }}
          />
          <Tab.Screen
            name="RewardEarned"
            component={RewardEarned}
            options={{
              title: 'Rewards',
            }}
          />
        </>
      ) : null}
    </Tab.Navigator>
  );
};

export default TabNavigation;

const styles = StyleSheet.create({});
