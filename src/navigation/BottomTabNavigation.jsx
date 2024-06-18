import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import React from 'react';
import Home from '../pages/Home/Home';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Settings from '../pages/Settings/Settings';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Avatar, Badge } from 'react-native-paper';
import Reward from '../pages/Reward/Reward';
import News from '../pages/News/News';
import Account from '../pages/Account/Account';
import Store from '../pages/Store/Store';
import { imgSrc } from '../assets/imgSrc';
import TabNavigation from './TabNavigation';
import Product from '../pages/Product/Product';
import { useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();

const BottomTabNavigation = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleAlign: 'center',
        tabBarActiveTintColor: '#5387C6', // Color for active tab label
        tabBarInactiveTintColor: 'gray', // Color for inactive tab label
        headerStyle: {
          backgroundColor: '#F6A917',
          // height: 60,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        },
        headerTitleStyle: {
          color: 'white',
          fontFamily: 'CircularStd-Bold',
          fontSize: 25,
          textTransform: 'uppercase',
          letterSpacing: 1,
        },
        headerBackgroundContainerStyle: {
          backgroundColor: route.name !== 'Store' && '#5387C6',
          borderBottomLeftRadius: route.name !== 'Store' ? 30 : 0,
          borderBottomRightRadius: route.name !== 'Store' ? 30 : 0,

        },
        tabBarStyle:
        {
          paddingBottom: Platform.OS === 'android' ? 6 : 25
          // backgroundColor:"black"
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? (
              <Image
                source={imgSrc.home_blue}
                style={{ width:  Platform.OS=== 'android'? 20:25, height:  Platform.OS=== 'android'? 20:25, alignSelf: 'center', marginTop: Platform.OS=== 'android'? 6:7 }}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={imgSrc.home_gray}
                style={{ width:  Platform.OS=== 'android'? 20:25, height:  Platform.OS=== 'android'? 20:25, alignSelf: 'center', marginTop: Platform.OS=== 'android'? 6:7 }}
                resizeMode="contain"
              />
            );
          } else if (route.name === 'Reward') {
            iconName = focused ? (
              <Image
                source={imgSrc.rewards_blue}
                style={{ width:  Platform.OS=== 'android'? 20:25, height:  Platform.OS=== 'android'? 20:25, marginTop: Platform.OS=== 'android'? 6:7 }}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={imgSrc.rewards_gray}
                style={{ width:  Platform.OS=== 'android'? 20:25, height:  Platform.OS=== 'android'? 20:25, marginTop: Platform.OS=== 'android'? 6:7 }}
                resizeMode="contain"
              />
            );
          } else if (route.name === 'Stores') {
            iconName = focused ? (
              <Image
                source={imgSrc.store_blue}
                style={{ width:  Platform.OS=== 'android'? 20:25, height:  Platform.OS=== 'android'? 20:25, marginTop: Platform.OS=== 'android'? 6:7 }}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={imgSrc.store_gray}
                style={{ width:  Platform.OS=== 'android'? 20:25, height:  Platform.OS=== 'android'? 20:25, marginTop: Platform.OS=== 'android'? 6:7 }}
                resizeMode="contain"
              />
            );
          } else if (route.name === 'News') {
            iconName = focused ? (
              <Image
                source={imgSrc.news_blue}
                style={{ width:  Platform.OS=== 'android'? 20:25, height:  Platform.OS=== 'android'? 20:25, marginTop: Platform.OS=== 'android'? 6:7}}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={imgSrc.news_gray}
                style={{ width:  Platform.OS=== 'android'? 20:25, height:  Platform.OS=== 'android'? 20:25, marginTop: Platform.OS=== 'android'? 6:7 }}
                resizeMode="contain"
              />
            );
          } else if (route.name === 'Account') {
            iconName = focused ? (
              <Image
                source={imgSrc.account_blue}
                style={{ width:  Platform.OS=== 'android'? 20:25, height:  Platform.OS=== 'android'? 20:25, marginTop: Platform.OS=== 'android'? 6:7 }}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={imgSrc.account_gray}
                style={{ width:  Platform.OS=== 'android'? 20:25, height:  Platform.OS=== 'android'? 20:25, marginTop: Platform.OS=== 'android'? 6:7}}
                resizeMode="contain"
              />
            );
          }
          return iconName;
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontFamily: 'CircularStd-Book',

          // marginBottom: 3
        },
      })}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: true,
          tabBarLabel: 'Home',
          headerTitle: () => (
            <Image
              style={{ height: 200, width: 200 }}
              resizeMode="contain"
              source={imgSrc.bb_linear_all_white}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Reward"
        component={Reward}
        options={{
          title: 'Rewards',
          headerShown: true,
          tabBarLabel: 'Rewards',
        }}
      />

      {/* <Tab.Screen
        name="Product"
        // component={Reward}
        component={Product}
        options={{
          title: 'Products',
          headerShown: true,
          tabBarLabel: 'Products',
          headerRight: () => {
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                style={{marginRight: 25}}
                onPress={() => navigation.navigate('Cart')}>
                <Badge
                  size={20}
                  style={{
                    position: 'absolute',
                    backgroundColor: '#5387C6',
                    zIndex: 1,
                  }}>
                  {carts.length > 99 ? `99+` : carts.length}
                </Badge>
                <Ionicons name="cart-outline" color="white" size={35} />
              </TouchableOpacity>
            );
          },
        }}
      /> */}

      {/* ===================== Store with tab navigation =============== */}

      {/* <Tab.Screen
        name="Store"
        component={TabNavigation}
        options={{
          title: 'Store Locator',
          headerShown: true,
          tabBarLabel: 'Stores',
          headerRight: () => {
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                style={{marginRight: 25}}
                onPress={() => navigation.navigate('Search')}>
                <Ionicons name="search" color="white" size={30} />
              </TouchableOpacity>
            );
          },
        }}
      /> */}



      <Tab.Screen
        name="Stores"
        component={Store}
        options={{
          headerShown: true,
          headerRight: () => {
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ marginRight: 25 }}
                onPress={() => navigation.navigate('Search')}>
                <Ionicons name="search" color="white" size={30} />
              </TouchableOpacity>
            );
          },
        }}
      />

      <Tab.Screen
        name="News"
        component={News}
        options={{
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          headerShown: true,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
