import { View, ActivityIndicator, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useDispatch,useSelector } from 'react-redux';
import { useNetInfo } from '../api/NetworkContext';
import BottomTabNavigation from './BottomTabNavigation';
import NewsDetailsScreen from '../pages/News/NewsDetailsScreen';
import Register from '../pages/Register/Register';
import { imgSrc } from '../assets/imgSrc';
import ContactPreferences from '../pages/Account/ContactPreferences';
import PersonalInformation from '../pages/Account/PersonalInformation';
import TransactionActivity from '../pages/Account/TransactionActivity';
import Help from '../pages/Account/Help';
import TermsConditions from '../pages/Account/TermsConditions';
import PrivacyPolicy from '../pages/Account/PrivacyPolicy';
import ConfirmationModal from '../components/ConfirmationModal';
import SignoutConfirmModal from '../components/SignoutConfirmModal';
import DeleteAccountConfirmModal from '../components/DeleteAccountConfirmModal';
import RedeemConfirmModal from '../components/RedeemConfirmModal';
import Cart from '../pages/Cart/Cart';
import ProductDetails from '../pages/Product/ProductDetails';
import Login from '../pages/Login/Login';
import LoginOrRegistration from '../pages/LoginOrRegistration/LoginOrRegistration';
import Scan from '../pages/Scan/Scan';
import { getAllRegion, getCurrentUserFromLocal, getUserById, setItemToLocal } from '../api/api';
import TabNavigation from './TabNavigation';
import Search from '../pages/Store/Search';
import Checkout from '../pages/Checkout/Checkout';
import ResetPassword from '../pages/Account/ResetAndForgetPW/ResetPassword';
import ForgotPassword from '../pages/Account/ResetAndForgetPW/ForgotPassword';
import InfoModal from '../components/InfoModal';
import ErrorModal from '../components/ErrorModal';
import FreeDrinkClaimConfirmModal from '../components/FreeDrinkClaimConfirmModal';
import ShowQRModal from '../components/ShowQRModal';
import FreeCoffeeAlertModal from '../components/FreeCoffeeAlertModal';
import { loginWithBiometric } from '../utils/BiometricUtils';
import ShowBiometric from '../pages/Account/ShowBiometric';
import NoInternet from '../pages/NoInternet/NoInternet';
import { allRegion } from '../redux/slices/regionSlice';
import { updateCurrUser } from '../redux/slices/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { isConnected } = useNetInfo();
  console.log("isConnected 1",isConnected);
  // const user = useSelector((state) => state.user?.currentUser);

  useEffect(() => {
    const initializeApp = async () => {
      if (isConnected) {
        const user = await getCurrentUserFromLocal();
        // console.log("user",user);
        if (user) {
          const userFromApi = await getUserById({user_id: user?._id});
          
          if (userFromApi?.data?.status) {
            
            await setItemToLocal('currentUser', userFromApi?.data);
            dispatch(updateCurrUser(userFromApi?.data));
            if (user?.enableBiometric) {
              const verified = await loginWithBiometric(user?._id);
              console.log("verified",verified);
              if (verified === true) {
                console.log("userFromApi",userFromApi?.data?.status);
                setInitialRoute('Main');
                
              } else {
                setInitialRoute('ShowBiometric');
              }
            } else {
              setInitialRoute('Main');
            }
          } else {
            console.log("LoginOrRegistration 2");
            await AsyncStorage.removeItem('currentUser');
            await AsyncStorage.removeItem('registerFreeCoffeeAlert');
            await AsyncStorage.removeItem('birthDayFreeCoffeeAlert');
            dispatch(updateCurrUser({}));
            setInitialRoute('LoginOrRegistration');
          }
        } else {
          console.log("LoginOrRegistration 1");
          setInitialRoute('LoginOrRegistration');
        }
        const allRegions = await getAllRegion();
        dispatch(allRegion(allRegions?.data));
      }
      setLoading(false);
    };

    initializeApp();
  }, [isConnected, navigation]);

  // useEffect(() => {
  //       if (!user?._id) {
  //         navigation.navigate.reset({
  //           index: 0,
  //           routes: [{ name: 'LoginOrRegistration' }],
  //         });
  //       }
  //     }, [user]);

  if (isConnected === false) {
    return <NoInternet />;
  }

  if (loading || !initialRoute) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#5387C6',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator color="white" size={40} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={() => ({
        headerBackTitleVisible: false,
        animation: 'fade',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#F6A917',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          color: 'white',
          fontFamily: 'CircularStd-Bold',
          fontSize: 30,
        },
        statusBarColor: '#F6A917',
      })}
    >
      <Stack.Screen
        name="LoginOrRegistration"
        component={LoginOrRegistration}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: '#5387C6',
          },
          statusBarColor: '#5387C6',
        }}
      />
      <Stack.Screen
        name="Main"
        component={BottomTabNavigation}
        options={{
          headerShown: false,
          statusBarColor: '#F6A917',
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerStyle: {
            backgroundColor: '#5387C6',
          },
          statusBarColor: '#5387C6',
        }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          headerTitle: () => (
            <Image
              style={{ height: 50, width: 200 }}
              resizeMode="contain"
              source={imgSrc.bb_linear_white_yellow}
            />
          ),
          headerStyle: {
            backgroundColor: '#5387C6',
          },
          statusBarColor: '#5387C6',
        }}
      />
      <Stack.Screen
        name="ContactPreferences"
        component={ContactPreferences}
        options={{
          title: 'ACCOUNT',
          headerTitleStyle: {
            color: 'white',
            fontFamily: 'CircularStd-Bold',
            fontSize: 30,
            textTransform: 'uppercase',
            letterSpacing: 1,
          },
          statusBarColor: '#F6A917',
        }}
      />
      <Stack.Screen
        name="PersonalInformation"
        component={PersonalInformation}
        options={{
          title: 'ACCOUNT',
          headerTitleStyle: {
            color: 'white',
            fontFamily: 'CircularStd-Bold',
            fontSize: 30,
            textTransform: 'uppercase',
            letterSpacing: 1,
          },
          statusBarColor: '#F6A917',
        }}
      />
      <Stack.Screen
        name="TransactionActivity"
        component={TabNavigation}
        options={{
          title: 'ACTIVITY',
          headerTitleStyle: {
            color: 'white',
            fontFamily: 'CircularStd-Bold',
            fontSize: 30,
            textTransform: 'uppercase',
            letterSpacing: 1,
          },
          statusBarColor: '#F6A917',
        }}
      />
      <Stack.Screen
        name="Help"
        component={Help}
        options={{
          title: 'ACCOUNT',
          headerTitleStyle: {
            color: 'white',
            fontFamily: 'CircularStd-Bold',
            fontSize: 30,
            textTransform: 'uppercase',
            letterSpacing: 1,
          },
          statusBarColor: '#F6A917',
        }}
      />
      <Stack.Screen
        name="TermsConditions"
        component={TermsConditions}
        options={{
          title: 'ACCOUNT',
          headerTitleStyle: {
            color: 'white',
            fontFamily: 'CircularStd-Bold',
            fontSize: 30,
            textTransform: 'uppercase',
            letterSpacing: 1,
          },
          statusBarColor: '#F6A917',
        }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{
          title: 'ACCOUNT',
          headerTitleStyle: {
            color: 'white',
            fontFamily: 'CircularStd-Bold',
            fontSize: 30,
            textTransform: 'uppercase',
            letterSpacing: 1,
          },
          statusBarColor: '#F6A917',
        }}
      />
      <Stack.Screen
        name="NewsDetailsScreen"
        component={NewsDetailsScreen}
        options={{
          title: 'NEWS',
        }}
      />
      <Stack.Screen
        name="NoInternet"
        component={NoInternet}
      />
      <Stack.Screen
        name="ShowBiometric"
        component={ShowBiometric}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Scan"
        component={Scan}
        options={{
          title: 'Scan code',
        }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{
          title: 'Product Details',
        }}
      />
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{
          title: 'Carts',
        }}
      />
      <Stack.Screen
        name="Checkout"
        component={Checkout}
        options={{
          title: 'Checkout',
        }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{
          title: 'ACCOUNT',
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{
          title: 'ACCOUNT',
        }}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{
          title: 'Search',
        }}
      />
      <Stack.Screen
        name="ConfirmationModal"
        component={ConfirmationModal}
        options={{
          headerShown: false,
          presentation: 'transparentModal',
        }}
      />
      <Stack.Screen
        name="InfoModal"
        component={InfoModal}
        options={{
          headerShown: false,
          presentation: 'transparentModal',
        }}
      />
      <Stack.Screen
        name="ErrorModal"
        component={ErrorModal}
        options={{
          headerShown: false,
          presentation: 'transparentModal',
        }}
      />
      <Stack.Screen
        name="RedeemConfirmModal"
        component={RedeemConfirmModal}
        options={{
          headerShown: false,
          presentation: 'transparentModal',
        }}
      />
      <Stack.Screen
        name="SignOut"
        component={SignoutConfirmModal}
        options={{
          headerShown: false,
          presentation: 'transparentModal',
        }}
      />
      <Stack.Screen
        name="DeleteAccount"
        component={DeleteAccountConfirmModal}
        options={{
          headerShown: false,
          presentation: 'transparentModal',
        }}
      />
      <Stack.Screen
        name="FreeDrinkClaimConfirmModal"
        component={FreeDrinkClaimConfirmModal}
        options={{
          headerShown: false,
          presentation: 'transparentModal',
        }}
      />
      <Stack.Screen
        name="FreeCoffeeAlertModal"
        component={FreeCoffeeAlertModal}
        options={{
          headerShown: false,
          presentation: 'transparentModal',
        }}
      />
      <Stack.Screen
        name="ShowQRModal"
        component={ShowQRModal}
        options={{
          headerShown: false,
          presentation: 'transparentModal',
        }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;
