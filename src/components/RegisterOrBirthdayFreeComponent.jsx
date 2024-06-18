import {
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { environment } from '../environments/environment';
import { Image } from 'react-native';
import { imgSrc } from '../assets/imgSrc';
import { textFormatter } from '../environments/formatter';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'react-native-vision-camera';
import { useSelector } from 'react-redux';
import { dateFormatter } from '../utils/Utils';
import moment from 'moment';

const RegisterOrBirthdayFreeComponent = ({ keyName, title, subtitle }) => {
  const navigation = useNavigation();
  const user = useSelector(state => state.currentUser.user);
  const settings = useSelector(state => state.settings.setting);

  const userCreatedDate = new Date(user?.created_at);

  const userDOB = new Date(user?.dob);

  const { free_coffee_birth_validity_day, free_coffee_reg_validity_day } =
    settings;

  moment.updateLocale('en', {
    week: {
      dow: 1, // Monday is the first day of the week
      doy: 7, // Sunday is the last day of the week
    },
  });

  // Function to get the start and end of the birthday week
  const getBirthdayWeek = birthday => {
    const birthdayThisYear = moment(birthday).year(moment().year());
    const startOfWeek = birthdayThisYear.clone().startOf('week');
    const endOfWeek = birthdayThisYear.clone().endOf('week');
    return { startOfWeek, endOfWeek };
  };

  // Function to reset the birthDayFreeCoffeeClaimed flag
  const resetBirthDayFreeCoffeeClaimed = user => {
    const { startOfWeek, endOfWeek } = getBirthdayWeek(user.birthday);
    const today = moment();
    if (today.isAfter(endOfWeek)) {
      user.birthDayFreeCoffeeClaimed = false;
      // Save user to the database
    }
  };

  const millisecondsToAdd =
    keyName === 'registerFreeCoffeeClaimed'
      ? parseInt(free_coffee_reg_validity_day) * 24 * 60 * 60 * 1000
      : parseInt(free_coffee_birth_validity_day) * 24 * 60 * 60 * 1000;

  const newDate =
    keyName === 'registerFreeCoffeeClaimed'
      ? new Date(userCreatedDate.getTime() + millisecondsToAdd)
      : getBirthdayWeek(userDOB).endOfWeek;

  const requestCameraPermission = async () => {
    const cameraPermission = await Camera.requestCameraPermission();
    if (cameraPermission === 'granted') {
      if (user.status === '1') {
        navigation.navigate('Scan', keyName);
      } else {
        // showToast('error', 'Error!', 'Verify Your Email !');
        navigation.navigate('ErrorModal', {
          title: `Verify Your Email !`,
          extra: {
            title: '',
            subTitle: 'Please verify your email to access your rewards and offers.',
          },
        });
      }
    }
  };

  return (
    <TouchableOpacity activeOpacity={1} style={styles.container}>
      <View style={styles.left}>
        <Image
          source={imgSrc.glass_free}
          resizeMode="contain"
          style={{
            height: 100,
            width: 100,
          }}
        />
      </View>
      <View style={styles.right}>
        <View style={{ width: '100%' }}>
          <Text
            style={
              Platform.OS === 'ios' ? styles.rewardTitleIOS : styles.rewardTitle
            }
            numberOfLines={2}
            >
            {title}
          </Text>
          <Text
            style={
              Platform.OS === 'ios'
                ? styles.rewardSubtitleIOS
                : styles.rewardSubtitle
            }
            numberOfLines={2}>
            {subtitle}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            requestCameraPermission();
          }}
          style={
            Platform.OS === 'ios'
              ? {
                width: '100%',
                height: 35,
                borderRadius: 6,
                backgroundColor: '#5387c6',
                alignItems: 'center',
                justifyContent: 'center',
              }
              : {
                width: '100%',
                height: 35,
                borderRadius: 6,
                backgroundColor: '#5387c6',
                alignItems: 'center',
                justifyContent: 'center',
              }
          }>
          <Text
            style={
              Platform.OS === 'ios'
                ? {
                  fontSize: 12,
                  color: 'white',
                  fontFamily: 'CircularStd-Bold',
                }
                : {
                  fontSize: 11,
                  color: 'white',
                  fontFamily: 'CircularStd-Bold',
                }
            }>
            Tap here to scan your code
          </Text>
        </Pressable>
        {keyName === 'stampsFreeCoffeeClaimable' ? (
          <Text style={{fontSize:10}}>Expires: Never</Text>
        ) : (
          <Text style={{fontSize:10}}>Expires: {dateFormatter(newDate)}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default RegisterOrBirthdayFreeComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 30,
    marginVertical: 5,
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  left: {
    width: '40%',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    paddingVertical: 20,
  },
  right: {
    width: '50%',
    gap: 5,
    // backgroundColor:'green'
  },
  rewardTitle: {
    fontSize: 17,
    fontFamily: 'CircularStd-Bold',
    color: '#5387C6',
    overflow: 'hidden',
  },
  rewardTitleIOS: {
    fontSize: 17,
    fontFamily: 'CircularStd-Bold',
    color: '#5387C6',
    overflow: 'hidden',
  },
  rewardSubtitle: {
    fontSize: 13,
    fontFamily: 'CircularStd-Bold',
    color: '#686868',
    overflow: 'hidden',
  },

  rewardSubtitleIOS: {
    fontSize: 10,
    fontFamily: 'CircularStd-Book',
    lineHeight: 10
  },
  rewardPoints: {
    fontSize: 15,
    fontFamily: 'CircularStd-Book',
    lineHeight: 10
  },
});
