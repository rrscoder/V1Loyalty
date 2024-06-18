import { View, Text } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../pages/Home/Home';
import Profile from '../pages/Account/Account';
import BottomTabNavigation from './BottomTabNavigation';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator initialRouteName="Tabs" screenOptions={{
      headerShown:false,
      drawerType:'slide'
      }}>
      <Drawer.Screen name="Tabs" component={BottomTabNavigation} />
      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
  )
}

export default DrawerNavigation