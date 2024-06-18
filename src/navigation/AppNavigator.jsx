import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import DrawerNavigation from './DrawerNavigation';
import StackNavigation from './StackNavigation';
import BottomTabNavigation from './BottomTabNavigation';
import {navigationRef} from './RootNavigation';
import {PermissionsAndroid, Platform} from 'react-native';
import {useDispatch} from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import {setUserCurrLocation} from '../redux/slices/currLocationSlice';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import { environment } from '../environments/environment';
const AppNavigator = () => {
  useEffect(() => {
    requestLocationPermission();
    initNotification();
  }, []);

  const initNotification = () => {
    // Remove this method to stop OneSignal Debugging
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    // OneSignal Initialization
    OneSignal.initialize(environment.onesignalAppId);
    OneSignal.Notifications.requestPermission(true);
    OneSignal.Notifications.addEventListener('opened', data => {
      console.log("Notifications Open");
    });
    
  };

  const dispatch = useDispatch();

  const requestLocationPermission = async () => {
    // try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            position => {
              dispatch(setUserCurrLocation(position?.coords));
            },
            error => {
              // See error code charts below.
              console.log(error.code, error.message);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          );
        } else {
          console.log('Location permission denied');
        }
      } else {
        console.log("whenInUse");
        Geolocation.requestAuthorization('whenInUse').then(granted => {
          Geolocation.getCurrentPosition(
            position => {
              console.log("position",position, 987);
              dispatch(setUserCurrLocation(position?.coords));
            },
            error => {
              // See error code charts below.
              console.log(error.code, error.message);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          );
        });
      }
    // } catch (err) {
    //   console.warn(err);
    // }
  };

  // console.log('AppNavigator');
  return (
    <NavigationContainer ref={navigationRef}>
      {/* <DrawerNavigation /> */}
      <StackNavigation />
      {/* <BottomTabNavigation /> */}
    </NavigationContainer>
  );
};

export default AppNavigator;

