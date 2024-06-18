import {
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Switch, Text} from 'react-native-paper';
import React, {useCallback, useEffect, useState} from 'react';
import ContactComponent from '../../components/ContactComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {imgSrc} from '../../assets/imgSrc';
import {checkBiometrics, loginWithBiometric} from '../../utils/BiometricUtils';
import {useDispatch, useSelector} from 'react-redux';
import {setItemToLocal, updateUserProfile} from '../../api/api';
import {updateCurrUser} from '../../redux/slices/userSlice';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {setUserCurrLocation} from '../../redux/slices/currLocationSlice';

const Help = ({navigation}) => {
  const user = useSelector(state => state.currentUser.user);
  const [enableBiometric, setEnableBiometric] = useState(user?.enableBiometric);
  const [enableLocation, setEnableLocation] = useState(false);
  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      console.log("useFocusEffect");
      requestLocationPermission();
    }, [enableLocation]),
  );

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      handlePermissionResult(granted === PermissionsAndroid.RESULTS.GRANTED);
    } else if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('whenInUse').then(granted => {
        if(granted === 'granted'){
          handlePermissionResult(true);
        } else{
          handlePermissionResult(false);
        }
      })
    }
  };

  const handlePermissionResult = isGranted => {
    if (isGranted) {
      Geolocation.getCurrentPosition(
        position => {
          dispatch(setUserCurrLocation(position?.coords));
          setEnableLocation(true);
        },
        error => {
          console.log(error.code, error.message);
          setEnableLocation(false);
          showPermissionAlert();
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } else {
      setEnableLocation(false);
      showPermissionAlert();
    }
  };

  const showPermissionAlert = () => {
    Alert.alert(
      'Location Permission',
      'Location permission is required. Please enable it in settings.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Open Settings', onPress: () => Linking.openSettings()},
      ],
    );
  };

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      style={{backgroundColor: '#5387C6'}}>
      <View style={styles.container}>
        <View>
          <Text style={Platform.OS === 'ios' ? styles.titleIOS : styles.title}>
            Help
          </Text>
          <Text
            variant="titleLarge"
            style={
              Platform.OS === 'ios'
                ? [
                    styles.subTitleIOS,
                    {
                      marginTop: 10,
                      fontFamily: 'CircularStd-Bold',
                      lineHeight: 21,
                    },
                  ]
                : [
                    styles.subTitle,
                    {
                      marginTop: 10,
                      lineHeight: 21,
                    },
                  ]
            }>
            Got a question or suggestion? Send us an email to
            <Text
              variant="titleLarge"
              style={[styles.subTitle, {lineHeight: 21}]}>
              {` marketing@bobandberts.com `}
            </Text>
            and we'll get back to you as soon as possible.
          </Text>
          <ContactComponent withBackground={true} />

          <View style={styles.pageGrp}>
            {checkBiometrics() && (
              <View style={styles.pagesEachRow}>
                <Text variant="titleLarge" style={styles.pages}>
                  Enable Biometric
                </Text>
                <Switch
                  trackColor={{false: '#ccc', true: '#81b0ff'}}
                  // thumbColor={true ? '#F6A917' : '#f4f3f4'}
                  thumbColor={enableBiometric ? '#F6A917' : '#f4f3f4'}
                  value={enableBiometric}
                  onValueChange={async e => {
                    setEnableBiometric(e);
                    const userData = await updateUserProfile({
                      enableBiometric: e,
                      _id: user['_id'],
                    });
                    setItemToLocal('currentUser', userData?.data);
                    dispatch(updateCurrUser(userData?.data));
                  }}
                />
              </View>
            )}
            <View style={styles.pagesEachRow}>
              <Text variant="titleLarge" style={styles.pages}>
                Enable Location
              </Text>
              <Switch
                trackColor={{false: '#ccc', true: '#81b0ff'}}
                thumbColor={enableLocation ? '#F6A917' : '#f4f3f4'}
                value={enableLocation}
                onValueChange={value => {
                  console.log("value",value)
                  if (value) {
                    requestLocationPermission();
                  } 
                  else {
                    setEnableLocation(false);
                  }
                }}
              />
            </View>

            {/* <Button mode="contained" onPress={() => {
              loginWithBiometric('1234')
            }}>
              Enable Biometric
            </Button> */}

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.pagesEachRow}
              onPress={() => {
                navigation.navigate('ResetPassword');
              }}>
              <Text variant="titleLarge" style={styles.pages}>
                Reset Password
              </Text>
              <Ionicons
                name="chevron-forward-outline"
                color="white"
                size={30}
              />
            </TouchableOpacity>

            {/* <TouchableOpacity
              activeOpacity={0.7}
              style={styles.pagesEachRow}
              onPress={() => {
                navigation.navigate('ForgotPassword');
              }}>
              <Text variant="titleLarge" style={styles.pages}>
                Forgot Password
              </Text>
              <Ionicons
                name="chevron-forward-outline"
                color="white"
                size={30}
              />
            </TouchableOpacity> */}

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.pagesEachRow}
              onPress={() => {
                navigation.navigate('DeleteAccount');
              }}>
              <Text variant="titleLarge" style={styles.pages}>
                Delete Account
              </Text>
              <Ionicons
                name="chevron-forward-outline"
                color="white"
                size={30}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bottomLogoAndVersion}>
          <Image
            style={styles.bottomLogo}
            resizeMode="contain"
            source={imgSrc.bb_linear_white_yellow}
          />
          {/* <Text variant="titleLarge" style={styles.bottomVersion}>
            Version 1.0
          </Text> */}
        </View>
      </View>
    </ScrollView>
  );
};

export default Help;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'CircularStd-Bold',
    color: 'white',
    fontSize: 30,
  },
  titleIOS: {
    fontFamily: 'CircularStd-Bold',
    color: 'white',
    fontSize: 30,
  },
  subTitle: {
    fontFamily: 'CircularStd-Book',
    color: 'white',
    fontSize: 17,
    fontFamily: 'CircularStd-Book',
    // letterSpacing: 0.5,
  },
  subTitleIOS: {
    fontFamily: 'CircularStd-Book',
    color: 'white',
    fontSize: 17,
    // letterSpacing: 0.5,
  },
  pageGrp: {
    marginTop: 20,
  },
  pages: {
    fontFamily: 'CircularStd-Book',
    color: 'white',
  },
  pagesEachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  bottomLogoAndVersion: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bottomLogo: {
    height: 20,
    width: 150,
  },
  bottomVersion: {
    fontFamily: 'CircularStd-Book',
    textAlign: 'center',
    color: 'white',
  },
});
