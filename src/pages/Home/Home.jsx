import {
  View,
  ScrollView,
  Image,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Linking,
  Platform,
  Dimensions,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Text } from 'react-native-paper';
import RewardPointsComponent from '../../components/RewardPointsComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import ContactComponent from '../../components/ContactComponent';
import { Camera } from 'react-native-vision-camera';
import { imgSrc } from '../../assets/imgSrc';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllDeliveryOptions,
  getAllRewards,
  getCurrentUserFromLocal,
  getSettings,
  getUserById,
  getValuesFromLocal,
  setItemToLocal,
  updateUserProfile,
} from '../../api/api';
import { updateCurrUser } from '../../redux/slices/userSlice';
import { allRewards } from '../../redux/slices/rewardSlice';
import RegisterOrBirthdayFreeComponent from '../../components/RegisterOrBirthdayFreeComponent';
import { showToast } from '../../utils/Utils';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { setSettings } from '../../redux/slices/settingSlice';
import { environment } from '../../environments/environment';
import { allDelOpts } from '../../redux/slices/deliveryOptionSlice';
import moment from 'moment';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useNetInfo } from '@react-native-community/netinfo';


const Home = ({ navigation }) => {

  const user = useSelector(state => state.currentUser.user);
  const rewards = useSelector(state => state.rewards.rewards) || [];
  const settings = useSelector(state => state.settings.setting);
  const today = moment();
  const currStamp = user?.current_stamp;
  // const currStamp = 10;

  const [loading, setLoading] = useState(true);
  const [delOpts, setDelOpts] = useState([]) || [];
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const dispatch = useDispatch();

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

  // Function to check if today is within the birthday week
  const isWithinBirthdayWeek = birthday => {
    const { startOfWeek, endOfWeek } = getBirthdayWeek(birthday);
    return today.isBetween(startOfWeek, endOfWeek, null, '[]');
  };

  const isWithinRegisterValidationDay = () => {
    const userCreatedAt = new Date(user?.created_at);

    const millisecondsToAdd =
      parseInt(settings?.free_coffee_reg_validity_day) * 24 * 60 * 60 * 1000;

    const regValDayToDate = new Date(
      userCreatedAt.getTime() + millisecondsToAdd,
    );

    return today.isBetween(userCreatedAt, regValDayToDate, null, '[]');
  };

  const getData = async () => {
    // await setItemToLocal('registerFreeCoffeeAlert', true);
    const currUser = await getCurrentUserFromLocal();

    // Function to reset the birthDayFreeCoffeeClaimed flag as false for next year
    if (
      currUser?.birthDayFreeCoffeeClaimed &&
      today.isAfter(getBirthdayWeek(new Date(currUser?.dob)).endOfWeek)
    ) {
      await updateUserProfile({
        birthDayFreeCoffeeClaimed: false,
        _id: currUser['_id'],
      });
    }

    const userfromApi = await getUserById({ user_id: currUser._id });
    const setting = await getSettings();
    const delOptsAPI = await getAllDeliveryOptions();

    const regFreeAlertShown = await getValuesFromLocal(
      'registerFreeCoffeeAlert',
    );
    const bDayFreeAlertShown = await getValuesFromLocal(
      'birthDayFreeCoffeeAlert',
    );

    setDelOpts(delOptsAPI?.deliveryOptions);

    dispatch(setSettings(setting?.data[0]));

    dispatch(allDelOpts(delOptsAPI?.deliveryOptions));

    setItemToLocal('currentUser', userfromApi?.data);
    dispatch(updateCurrUser(userfromApi?.data));

    const rewards = await getAllRewards({ user_id: currUser._id });
    dispatch(allRewards(rewards?.data));

    setLoading(false);

    if (!userfromApi?.data?.registerFreeCoffeeClaimed && regFreeAlertShown) {
      navigation.navigate('FreeCoffeeAlertModal', {
        data: {
          keyName: 'registerFreeCoffeeClaimed',
          title: 'Thanks for signing up!',
          subTitle: 'Have a free coffee on Bob!',
        },
      });
    }

    // free coffee for bday
  };

  const requestCameraPermission = async () => {
    const cameraPermission = await Camera.requestCameraPermission();
    if (cameraPermission === 'granted') {
      if (user.status === '1') {
        navigation.navigate('Scan');
      } else {
        // showToast('error', 'Error!', 'Verify Your Email !');
        navigation.navigate('ErrorModal', {
          title: `Verify Your Email !`,
          extra: {
            title:
              '',
            subTitle:
              'Please verify your email to access your rewards and offers.',
          },
        });
      }
    } else {
      navigation.navigate('ErrorModal', {
        title: `Allow camera access`,
        extra: {
          title: '',
          subTitle: 'The app needs camera access to scan the QR Codes',
        },
      });
    }
  };

  const { isConnected } = useNetInfo();
  useFocusEffect(
    useCallback(() => {
      if (isConnected) {
        getData();

      }
    }, [isConnected]),
  );

  const claimedReward =
    rewards.length > 0 && rewards?.filter(reward => reward.claimed === true);

  const notClaimed =
    rewards?.length > 0 &&
    rewards
      ?.filter(reward => reward.claimed === false)
      .map(m =>
        m.reward_points
          ? { ...m, reward_points: parseInt(m?.reward_points) }
          : { ...m, reward_points: parseInt(m?.product?.product_point) },
      )
      .sort((a, b) => a.reward_points - b.reward_points);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#5387C6',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: -30, paddingTop: 30,
        }}>
        <ActivityIndicator color="white" size={40} />
      </View>
    );
  }

  return (
    <ScrollView style={{ display: 'flex', backgroundColor: '#5387C6', marginTop: -30, paddingTop: 30, }}>
      <View style={{ paddingBottom: 30 }}>
        {isWithinRegisterValidationDay() &&
          !user?.registerFreeCoffeeClaimed && (
            <RegisterOrBirthdayFreeComponent
              keyName="registerFreeCoffeeClaimed"
              title="1 FREE COFFEE"
              subtitle="1 free coffee for registering your account"
            />
          )}

        {isWithinBirthdayWeek(new Date(user?.dob)) &&
          !user?.birthDayFreeCoffeeClaimed && (
            <RegisterOrBirthdayFreeComponent
              keyName="birthDayFreeCoffeeClaimed"
              title="1 FREE COFFEE"
              subtitle="1 free coffee for your birthday"
            />
          )}

        {user?.stampsFreeCoffeeClaimable && (
          <RegisterOrBirthdayFreeComponent
            keyName="stampsFreeCoffeeClaimable"
            title="1 FREE COFFEE"
            subtitle="1 free coffee for your 10 stamps"
          />
        )}
        <Text
          variant="headlineLarge"
          className="mt-5 text-white text-center" // Tailwind classes
          style={{
            fontFamily: 'CircularStd-Bold',
            fontWeight: Platform.OS === 'ios' ? 'bold' : 400,
          }}>
          Hey, {user?.firstName}
        </Text>
        <View
          style={{
            backgroundColor: '#F6A917',
            marginHorizontal: 30,
            marginVertical: 15,
            display: 'flex',
            alignItems: 'center',
            borderRadius: 20,
          }}>
          <Text
            variant="headlineLarge"
            style={{
              fontSize: 25,
              fontFamily: 'CircularStd-Bold',
              marginVertical: 15,
              color: 'white',
              textAlign: 'center',
            }}>
            {user?.firstName}'s Loyalty card
          </Text>
          <Button
            mode="contained"
            buttonColor="white"
            textColor="#F6A917"
            labelStyle={{
              fontSize: 16,
            }}
            style={{ marginBottom: 20 }}
            onPress={() => {
              requestCameraPermission();
            }}>
            SCAN TO STAMP
          </Button>
        </View>

        <View style={{ marginBottom: 10 }}>
          {/* <Text
            variant="titleLarge"
            className="text-center text-white font-bold"
            style={{
              marginHorizontal: 40,
              fontFamily: 'CircularStd-Bold',
            }}>
            YOU ARE {9 - currStamp} STAMPS AWAY FROM A FREE DRINK!
          </Text> */}
          {currStamp <= 9 && (
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'CircularStd-Bold',
                marginBottom: 10,
                color: 'white',
                marginHorizontal: 40,
                textAlign: 'center',
                lineHeight: 28
              }}>
              {`YOU ARE ${9 - currStamp} STAMPS AWAY FROM A FREE DRINK!`}
            </Text>
          )}
        </View>
        <View
          style={{
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            flexWrap: 'wrap',
            marginHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
            width: '95%',
            alignSelf: 'center',
            // backgroundColor:'red'
          }}>
          {arr.map(m =>
            currStamp >= m ? (
              <ImageBackground
                key={m}
                source={imgSrc.chat_bubble_left_filled}
                style={styles.imageIOS}
                resizeMode="contain">
                <Text
                  style={
                    Platform.OS === 'ios'
                      ? styles.filledTextIOS
                      : styles.filledText
                  }>
                  {m === 10 ? 'FREE' : m}
                </Text>
              </ImageBackground>
            ) : (
              <ImageBackground
                key={m}
                source={imgSrc.chat_bubble_left}
                style={styles.imageIOS}
                resizeMode="contain">
                <Text
                  style={[
                    Platform.OS === 'ios' ? styles.textIOS : styles.text,
                    { fontSize: m === 10 ? 15 : 18 },
                  ]}>
                  {m === 10 ? 'FREE' : m}
                </Text>
              </ImageBackground>
            ),
          )}
        </View>
        <View>
          <RewardPointsComponent currUser={user} rewards={notClaimed[0]} />
        </View>
        <View style={styles.favOrder}>
          <View style={{ marginLeft: 5, marginBottom: 5 }}>
            <Text
              style={
                Platform.OS === 'ios'
                  ? styles.favOrderHeaderTextIOS
                  : styles.favOrderHeaderText
              }>
              HOW IT WORKS
            </Text>
          </View>
          <View style={{ width: '100%' }}>
            <View style={[styles.bulletPointsContainer,]}>
              <View style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>Collect 9 stamps & get your 10th coffee free!</Text>
              </View>
              <View style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>Earn points while you sip, 1 drink = 2 points</Text>
              </View>
              <View style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>Exchange points for Bob & Berts rewards</Text>
              </View>
            </View>
          </View>
          {/* <View style={styles.favOrderLogos}>
            {delOpts?.length > 0 &&
              delOpts?.map(m => (
                <Pressable
                  key={m?._id}
                  onPress={() => {
                    navigation.navigate('Store');
                    // Linking.openURL(m?.delivery_option_url);
                  }}>
                  <Image
                    style={styles.tinyLogo}
                    source={{
                      uri: `${environment.url}uploads/deliveryOption/${m?.delivery_option_image}`,
                    }}
                    resizeMode="contain"
                  />
                </Pressable>
              ))}

          </View> */}
        </View>
        <ContactComponent />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIOS: {
    width: Dimensions.get('screen').width * 0.19 - 10,
    height: Dimensions.get('screen').width * 0.18 - 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#5387C6', // Adjust color as needed
    marginBottom: 10,
    transform: [{ rotate: '-10deg' }],
    fontFamily: 'CircularStd-Bold',
  },
  textIOS: {
    fontSize: 16,
    color: '#5387C6', // Adjust color as needed
    marginBottom: 12,
    transform: [{ rotate: '-10deg' }],
    fontFamily: 'CircularStd-Bold',
  },
  filledText: {
    fontSize: 18,
    color: 'white', // Adjust color as needed
    marginBottom: 12,
    transform: [{ rotate: '-10deg' }],
    fontFamily: 'CircularStd-Bold',
  },
  filledTextIOS: {
    fontSize: 18,
    color: 'white', // Adjust color as needed
    marginBottom: 12,
    transform: [{ rotate: '-10deg' }],
    fontFamily: 'CircularStd-Bold',
  },
  favOrder: {
    marginVertical: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    display: 'flex',
    width: '95%',
    // height:150,
    alignSelf: 'center'
    // alignItems: 'center',
    // marginBottom: 60,
  },
  favOrderHeaderText: {
    fontFamily: 'CircularStd-Bold',
    fontSize: 20,
    textAlign: 'left',
    color: '#5387C6',
  },
  favOrderHeaderTextIOS: {
    fontFamily: 'CircularStd-Bold',
    fontSize: 20,
    textAlign: 'left',
    color: '#5387C6',
  },
  favOrderLogos: {
    width: '95%',
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  contact: {
    gap: 15,
    marginBottom: 20,
  },
  contactHeaderText: {
    fontFamily: 'CircularStd-Bold',
    fontSize: 25,
    textAlign: 'center',
    color: 'white',
  },
  contactLogos: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  bullet: {
    fontSize: 15,
    marginRight: 8,
    color: 'gray',
  },
  bulletText: {
    fontSize: 12,
    color: '#909090',
  },
  bulletPointsContainer: {
    padding: 4,
  },
});

export default Home;
