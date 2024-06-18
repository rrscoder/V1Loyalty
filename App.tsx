/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {StyleSheet, StatusBar, View, PermissionsAndroid} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppNavigator from './src/navigation/AppNavigator';
import {Provider, useDispatch} from 'react-redux';
import {store} from './src/redux/store';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';
import {NetInfoProvider} from './src/api/NetworkContext';

const App = () => {
  useEffect(() => {
    // setTimeout(()=>{
    SplashScreen.hide();
    // },1000)
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar animated={true} backgroundColor="#F6A917" />
        <NetInfoProvider>
          <AppNavigator />
        </NetInfoProvider>
        <Toast />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
