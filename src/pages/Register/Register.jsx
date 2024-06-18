import {
  Pressable,
  StyleSheet,
  View,
  Platform,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { Button, Text, TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
// import * as RootNavigation from '../../navigation/RootNavigation';
import { calculateDistance, countryData, getLatLong } from '../../utils/Utils';
import { useDispatch, useSelector } from 'react-redux';
import { getAllStores, isUserExist } from '../../api/api';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { allStores } from '../../redux/slices/storeSlice';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useNetInfo } from '../../api/NetworkContext';
import NoInternet from '../NoInternet/NoInternet';
import { environment } from '../../environments/environment';
import {OneSignal} from 'react-native-onesignal';

// utils/debounce.js
export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    return new Promise((resolve) => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        const result = await func(...args);
        resolve(result);
      }, wait);
    });
  };
};

export const RegistrationSchema = Yup.object()
  .shape({
    firstName: Yup.string()
      .required('First Name is required')
      .min(3, 'First name must be at least 3 characters long'),
    lastName: Yup.string()
      .min(3, 'Last name must be at least 3 characters long')
      .required('Last Name is required'),
    email: Yup.string()
      .email('Must be a valid email')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters long')
      .matches(/[a-z]/, 'Password must contain a lowercase letter')
      .matches(/[A-Z]/, 'Password must contain an uppercase letter')
      .matches(/\d/, 'Password must contain a number')
      .matches(
        /[!@#$%^&*_]/,
        'Password must contain a special character (#?!@$%^&*_)',
      )
      .required('Password is required'),
    cnfPassword: Yup.string()
      .min(6, 'Password should be min of 6')
      .oneOf(
        [Yup.ref('password'), null],
        `Confirm Password doesn't match with Password`,
      )
      .required('Confirm Password is required'),
    phoneCode: Yup.string().required('Phone code is required'),
    phoneNumber: Yup.string()
      .required('Phone number is required')
      .min(10, 'Number should have minimum of 10 digits and maximum of 11 digits')
      .max(11, 'Number should have maximum of 11 digits'),
    day: Yup.number()
      .min(1, 'Day must be between 1 and 31')
      .max(31, 'Day must be between 1 and 31')
      .required('Day is required'),
    month: Yup.number()
      .min(1, 'Month must be between 1 and 12')
      .max(12, 'Month must be between 1 and 12')
      .required('Month is required'),
    year: Yup.number()
      .min(1960, 'Year must be after 1960')
      .max(
        new Date().getFullYear(),
        'Year must be before or equal to current year',
      )
      .required('Year is required'),
    address1: Yup.string().required('Address 1 is required'),
    // address2: Yup.string().required('Address 2 is required'),
    town: Yup.string().required('Town is required'),
    postcode: Yup.string().required('Postcode is required'),
    country: Yup.string().required('Country is required'),
    region: Yup.string().required('Region is required'),
    nearestStore: Yup.string().required('Nearest Store is required'),
  })
  .test('validDate', 'Invalid date', function (value) {
    const today = moment().valueOf();

    const { day, month, year } = value;

    if (today < Date.parse(`${year}-${month}-${day}`)) {
      console.log(today, Date.parse(`${year}-${month}-${day}`));
      console.log('wrong');
      return this.createError({
        path: 'day',
        message: 'You are entering a future date.',
      });
    }

    return true;
  });

const Register = () => {
  const [showPW, setShowPW] = useState(false);
  const [showCnfPW, setShowCnfPW] = useState(false);
  const [userLatLong, setUserLatLong] = useState({});
  const { isConnected } = useNetInfo();
  const [isEmailValid, setIsEmailValid] = useState('');
  const [isDeviceToken, setDeviceToken] = useState('');
  

  console.log(isConnected, 387);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const regions = useSelector(state => state.region.region);
  const stores = useSelector(state => state.stores.stores);

  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const conformpasswordRef = useRef(null);
  const postcodeRef = useRef(null);
  const phonenumberRef = useRef(null);
  const dayRef = useRef(null);
  const address1Ref = useRef(null);
  const address2Ref = useRef(null);

  const regionRef = useRef();
  const storeRef = useRef();


  const countries = countryData
    .filter(f => f?.phoneCode)
    .map(m => {
      return {
        label: `${m.name} (${m.phoneCode})`,
        value: m.phoneCode,
        countryName: m.name,
      };
    });

  const sortedRegion =
    regions?.length > 0 &&
    [...regions]
      ?.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return 1;
        if (nameA > nameB) return -1;
        return 0;
      })
      .map(r => ({ label: r?.name, value: r?.name }));

      const handleCustomChange = async (value, setFieldValue) => {
        setFieldValue('email', value.toLowerCase());
          const response = await isUserExist({email: value.toLowerCase()});
          console.log("response",response);
          if (response?.success) {
            console.log('success');
            setIsEmailValid(response?.message);
          } else {
            console.log('error');
            setIsEmailValid(response?.message);
          }
      };

      useEffect(() => {
        // const deviceId = OneSignal.User.pushSubscription.getPushSubscriptionToken();
        // console.log(deviceId, 787);
        const subId = OneSignal.User.pushSubscription.getPushSubscriptionId();
        setDeviceToken(subId);
        console.log("subId",subId);
      }, []);

  return (
    <>
      {isConnected ? (
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="always"
            style={{ backgroundColor: '#5387C6' }}
            contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.textRegisterView}>
              <Text  style={styles.textRegister}>
                Register
              </Text>
            </View>

            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                cnfPassword: '',
                phoneCode: '+44',
                phoneNumber: '',
                day: '',
                month: '',
                year: '',
                address1: '',
                address2: '',
                town: '',
                postcode: '',
                country: 'United Kingdom',
                region: '',
                nearestStore: '',
                token: isDeviceToken
              }}
              onSubmit={async values => {
                navigation.navigate('ContactPreferences', {
                  comingFrom: 'Register',
                  registerFormData: values,
                });
              }}
              validationSchema={RegistrationSchema}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                values,
                touched,
                errors,
              }) => {
                useEffect(() => {
                  if (isDeviceToken) {
                    setFieldValue('token', isDeviceToken);
                  }
                  const fetchLatLongIfNeeded = async () => {
                    // console.log('fetchLatLongIfNeeded called');
                    if (
                      values.address1 &&
                      values.town &&
                      values.country &&
                      values.postcode
                    ) {
                      try {
                        const latLong = await getLatLong(
                          `${values.address1}, ${values.town}, ${values.postcode}`,
                        );

                        const getAllStore = async () => {
                          console.log('called');
                          const stores = await getAllStores();
                          console.log("stores",stores);
                          const addDistance = stores?.data.map(store => ({
                            ...store,
                            distance: parseFloat(
                              calculateDistance(
                                latLong?.lat,
                                latLong?.lng,
                                store?.store_latitude,
                                store?.store_longitude,
                                'miles',
                              ).toFixed(2),
                            ),
                          }));
                          console.log(addDistance, 36);
                          dispatch(allStores(addDistance));
                          // setLoading(false);
                        };

                        getAllStore();
                      } catch (error) {
                        console.log('Error fetching lat/long:', error);
                      }
                    } else {
                      console.log('something is not provided 1');
                    }
                  };
                  fetchLatLongIfNeeded();
                }, [
                  values.address1,
                  values.town,
                  values.postcode,
                  values.country,
                  isDeviceToken
                ]);
                return (
                  <View style={styles.inpGrp}>
                    {/* ============== First Name ==========*/}
                    <Text style={styles.inpLabel}>First Name</Text>
                    <TextInput
                      ref={firstNameRef}
                      id="firstName"
                      style={styles.inp}
                      placeholder="John"
                      underlineStyle={{
                        display: 'none',
                      }}
                      outlineStyle={{
                        borderRadius: 20,
                      }}
                      onChangeText={handleChange('firstName')}
                      onBlur={handleBlur('firstName')}
                      value={values.firstName}
                      returnKeyType='next'
                      // onSubmitEditing={() => lastNameRef.current.focus()}
                      onSubmitEditing={() => {
                        if (lastNameRef.current) {
                          setTimeout(() => lastNameRef.current.focus(), 100);
                        }
                      }}
                    />
                    {errors.firstName && touched.firstName ? (
                      <Text style={styles.errorText}>{errors.firstName}</Text>
                    ) : null}

                    {/* ============== Last Name ==========*/}

                    <Text style={styles.inpLabel}>Last Name</Text>
                    <TextInput
                      ref={lastNameRef}
                      id="lastName"
                      style={styles.inp}
                      placeholder="Doe"
                      underlineStyle={{
                        display: 'none',
                      }}
                      outlineStyle={{
                        borderRadius: 20,
                      }}
                      onChangeText={handleChange('lastName')}
                      onBlur={handleBlur('lastName')}
                      value={values.lastName}
                      returnKeyType="next"
                      // onSubmitEditing={() => emailRef.current.focus()}
                      onSubmitEditing={() => {
                        if (emailRef.current) {
                          setTimeout(() => emailRef.current.focus(), 100);
                        }
                      }}

                    />
                    {errors.lastName && touched.lastName ? (
                      <Text style={styles.errorText}>{errors.lastName}</Text>
                    ) : null}

                    {/* ============== Email ==========*/}

                    <Text style={styles.inpLabel}>Email</Text>
                    <TextInput
                      ref={emailRef}
                      id="email"
                      keyboardType="email-address"
                      style={styles.inp}
                      placeholder="johndoe@gmail.com"
                      underlineStyle={{
                        display: 'none',
                      }}
                      outlineStyle={{
                        borderRadius: 20,
                      }}
                      // onChangeText={handleChange('email')}
                      onChangeText={(text) => handleCustomChange(text, setFieldValue)}
                      onBlur={handleBlur('email')}
                      value={values.email.toLowerCase()}
                      returnKeyType="next"
                      // onSubmitEditing={() => passwordRef.current.focus()}
                      onSubmitEditing={() => {
                        if (passwordRef.current) {
                          setTimeout(() => passwordRef.current.focus(), 100);
                        }
                      }}
                      
                    />
                    {errors.email && touched.email ? (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    ) : null}
                    {errors.checkEmailExists ? (
                      <Text style={styles.errorText}>
                        {errors.checkEmailExists}
                      </Text>
                    ) : null}
                    {isEmailValid !== '' && (
                      <Text style={styles.errorText}>{isEmailValid}</Text>
                    )}


                    {/* ============== Password =========== */}

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        marginBottom: 5,
                        marginTop: 10,
                      }}>
                      <Text
                        style={[
                          styles.inpLabel,
                          { marginBottom: 0, marginTop: 0 },
                        ]}>
                        Password
                      </Text>
                      <Pressable
                        onPress={() => {
                          navigation.navigate('InfoModal');
                        }}>
                        <Ionicons
                          name="information-circle-outline"
                          size={15}
                          color="white"
                        />
                      </Pressable>
                    </View>

                    {/* <Text style={styles.inpLabel}>Password</Text> */}
                    <TextInput
                      ref={passwordRef}
                      id="password"
                      secureTextEntry={showPW ? false : true}
                      style={styles.inp}
                      placeholder="Password"
                      underlineStyle={{
                        display: 'none',
                      }}
                      outlineStyle={{
                        borderRadius: 20,
                      }}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      returnKeyType='next'
                      // onSubmitEditing={() => conformpasswordRef.current?.focus()}
                      onSubmitEditing={() => {
                        if (conformpasswordRef.current) {
                          setTimeout(() => conformpasswordRef.current.focus(), 100);
                        }
                      }}

                      right={
                        <TextInput.Icon
                          icon={showPW ? 'eye' : 'eye-off'}
                          onPress={() => {
                            setShowPW(!showPW);
                          }}
                        />
                      }
                    />
                    {errors.password && touched.password ? (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    ) : null}

                    {/* ============== Confirm Password =========== */}

                    <Text style={styles.inpLabel}>Confirm Password</Text>
                    <TextInput
                      ref={conformpasswordRef}
                      id="cnfPassword"
                      secureTextEntry={showCnfPW ? false : true}
                      style={styles.inp}
                      placeholder="Confirm Password"
                      underlineStyle={{
                        display: 'none',
                      }}
                      outlineStyle={{
                        borderRadius: 20,
                      }}
                      onChangeText={handleChange('cnfPassword')}
                      onBlur={handleBlur('cnfPassword')}
                      value={values.cnfPassword}
                      returnKeyType='next'
                      // onSubmitEditing={() => phonenumberRef.current.focus()}
                      onSubmitEditing={() => {
                        if (phonenumberRef.current) {
                          setTimeout(() => phonenumberRef.current.focus(), 100);
                        }
                      }}
                      right={
                        <TextInput.Icon
                          icon={showCnfPW ? 'eye' : 'eye-off'}
                          onPress={() => {
                            setShowCnfPW(!showCnfPW);
                          }}
                        />
                      }
                    />
                    {errors.cnfPassword && touched.cnfPassword ? (
                      <Text style={styles.errorText}>{errors.cnfPassword}</Text>
                    ) : null}

                    {/* ============== Phone Code ==========*/}
                    <Text style={styles.inpLabel}>Phone Code</Text>

                    <View
                      style={{ backgroundColor: '#e9dfed', borderRadius: 10 }}>
                      <Dropdown
                        style={{
                          height: 55,
                          borderRadius: 10,
                          paddingHorizontal: 8,
                          paddingStart: 15,
                        }}
                        containerStyle={{
                          backgroundColor: 'white',
                          borderRadius: 10,
                        }}
                        itemTextStyle={{
                          color: 'black',
                        }}
                        selectedTextStyle={{
                          color: 'black',
                        }}
                        ref={postcodeRef}
                        id="phoneCode"
                        data={countries}
                        search
                        maxHeight={400}
                        labelField="label"
                        valueField="value"
                        placeholder="Select phone code"
                        searchPlaceholder="Search..."
                        value={values.phoneCode}
                        
                        onFocus={() => {
                          handleBlur('phoneCode');
                        }}
                        onBlur={() => {
                          handleBlur('phoneCode');
                        }}
                        onChange={item => {
                          setFieldValue('phoneCode', item.value);
                          setFieldValue('country', item.countryName);
                        }}
                        returnKeyType='next'
                        // onSubmitEditing={() => phonenumberRef.current && phonenumberRef?.current?.focus()}
                        onSubmitEditing={() => {
                          if (phonenumberRef.current) {
                            setTimeout(() => phonenumberRef.current.focus(), 100);
                          }
                        }}

                      />

                    </View>
                    {errors.phoneCode && touched.phoneCode ? (
                      <Text style={styles.errorText}>{errors.phoneCode}</Text>
                    ) : null}

                    {/* ============== Phone Number ==========*/}

                    <Text style={styles.inpLabel}>Phone Number</Text>
                    <TextInput
                      ref={phonenumberRef}
                      id="phoneNumber"
                      style={styles.inp}
                      placeholder="Enter Phone Number"
                      underlineStyle={{
                        display: 'none',
                      }}
                      outlineStyle={{
                        borderRadius: 20,
                      }}
                      keyboardType="numeric"
                      onChangeText={handleChange('phoneNumber')}
                      onBlur={handleBlur('phoneNumber')}
                      value={values.phoneNumber}
                      maxLength={11}
                      returnKeyType='next'
                      // onSubmitEditing={() => dayRef.current.focus()}
                      onSubmitEditing={() => {
                        if (dayRef.current) {
                          setTimeout(() => dayRef.current.focus(), 100);
                        }
                      }}
                    />
                    {errors.phoneNumber && touched.phoneNumber ? (
                      <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                    ) : null}

                    {/* ============== DOB ==========*/}

                    <Text style={styles.inpLabel}>Date of Birth</Text>
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                      }}>
                      <TextInput
                        ref={dayRef}
                        id="day"
                        style={[styles.inp, { width: '30%' }]}
                        placeholder="dd"
                        underlineStyle={{
                          display: 'none',
                        }}
                        outlineStyle={{
                          borderRadius: 20,
                        }}
                        keyboardType="numeric"
                        // onChangeText={handleChange('day')}
                        onChangeText={(text) => {
                          handleChange('day')(text);
                          if (text.length === 2) {
                            monthRef.current?.focus();
                          }
                        }}
                        onBlur={handleBlur('day')}
                        value={values.day}
                      />
                      <Text style={{ fontSize: 40, color: 'white' }}>-</Text>
                      <TextInput
                        id="month"
                        ref={monthRef}
                        style={[styles.inp, { width: '30%' }]}
                        placeholder="mm"
                        underlineStyle={{
                          display: 'none',
                        }}
                        outlineStyle={{
                          borderRadius: 20,
                        }}
                        keyboardType="numeric"
                        // onChangeText={handleChange('month')}
                        onChangeText={(text) => {
                          handleChange('month')(text);
                          if (text.length === 2) {
                            yearRef.current.focus();
                          }
                        }}
                        onBlur={handleBlur('month')}
                        value={values.month}
                      />
                      <Text style={{ fontSize: 40, color: 'white' }}>-</Text>
                      <TextInput
                        id="year"
                        ref={yearRef}
                        style={[styles.inp, { width: '30%' }]}
                        placeholder="yyyy"
                        underlineStyle={{
                          display: 'none',
                        }}
                        outlineStyle={{
                          borderRadius: 20,
                        }}
                        keyboardType="numeric"
                        onChangeText={handleChange('year')}
                        onBlur={handleBlur('year')}
                        value={values.year}
                        returnKeyType='next'
                        // onSubmitEditing={() => address1Ref.current && address1Ref?.current?.focus()}
                        onSubmitEditing={() => {
                          if (address1Ref.current) {
                            setTimeout(() => address1Ref.current.focus(), 100);
                          }
                        }}
                      />
                    </View>
                    {(errors.day && touched.day) ||
                      (errors.month && touched.month) ||
                      (errors.year && touched.year) ||
                      errors.validDate ? (
                      <Text style={styles.errorText}>
                        {errors.day && touched.day
                          ? errors.day
                          : errors.month && touched.month
                            ? errors.month
                            : errors.year && touched.year
                              ? errors.year
                              : errors.validDate}
                      </Text>
                    ) : null}

                    <Text style={styles.errorText}>
                      Please ensure you enter the correct DOB as this is not
                      changeable.
                    </Text>

                    {/* ============== Address Line 1 ==========*/}

                    <Text style={styles.inpLabel}>Address Line 1</Text>
                    <GooglePlacesAutocomplete
                      placeholder="Enter Address Line 1"
                      ref={address1Ref}

                      disableScroll={true}
                      fetchDetails={true}
                      listViewDisplayed={false}
                      enablePoweredByContainer={false}

                      onPress={(data, details = null) => {
                        console.log('Selected Place Data: ', data);
                        console.log('Selected Place Details: ', details);
                      
                        // Extracting only the street address from the formatted address
                        const streetAddress = details?.address_components.find(component => component.types.includes('route'))?.long_name || '';
                      
                        setFieldValue('address1', streetAddress);
                      
                        details?.address_components.forEach(component => {
                          // for country
                          if (component.types.includes('country')) {
                            setFieldValue('country', component.long_name);
                          }
                          // for postcode
                          if (component.types.includes('postal_code')) {
                            setFieldValue('postcode', component.long_name);
                          }
                          if (!component.types.includes('postal_code')) {
                            setFieldValue('postcode', '');
                          }
                          // for town
                          if (component.types.includes('locality')) {
                            setFieldValue('town', component.long_name);
                          }
                      
                          if (
                            !values.town &&
                            component.types.includes('administrative_area_level_1')
                          ) {
                            setFieldValue('town', component.long_name);
                          }
                        });
                        
                      }}
                      returnKeyType='next'
                      onSubmitEditing={() => {
                        if (address2Ref.current) {
                          setTimeout(() => address2Ref.current.focus(), 100);
                        }
                      }}
                      onFail={error => console.error('Error: ', error)}
                      query={{
                        key: environment.GOOGLE_API_KEY,
                        language: 'en',
                        components: 'country:gb'
                      }}
                      styles={{
                        container: { flex: 1 },
                        textInputContainer: {
                          width: '100%',
                        },
                        textInput: {
                          height: 55,
                          color: 'black',
                          fontSize: 16,
                          borderRadius: 10,
                          backgroundColor: '#e9dfed',
                          paddingLeft: 15,
                        },
                        listView: {
                          backgroundColor: 'white',
                        },
                      }}
                      nearbyPlacesAPI="GooglePlacesSearch"
                      debounce={200}
                      
                    />
                    


                    {/* ============== Address Line 2 ==========*/}

                    <Text style={styles.inpLabel}>
                      Address Line 2 ( Optional )
                    </Text>
                    <TextInput
                      ref={address2Ref}
                      id="address2"
                      style={styles.inp}
                      placeholder="Enter Address Line 2"
                      underlineStyle={{
                        display: 'none',
                      }}
                      outlineStyle={{
                        borderRadius: 20,
                      }}
                      onChangeText={handleChange('address2')}
                      onBlur={handleBlur('address2')}
                      value={values.address2}
                    />
                    {errors.address2 && touched.address2 ? (
                      <Text style={styles.errorText}>{errors.address2}</Text>
                    ) : null}
                    {/* ============== Town ==========*/}

                    <Text style={styles.inpLabel}>Town / City</Text>
                    <TextInput
                      id="town"
                      style={styles.inp}
                      placeholder="Enter town"
                      underlineStyle={{
                        display: 'none',
                      }}
                      outlineStyle={{
                        borderRadius: 20,
                      }}
                      onChangeText={handleChange('town')}
                      onBlur={handleBlur('town')}
                      value={values.town}
                    />
                    {errors.town && touched.town ? (
                      <Text style={styles.errorText}>{errors.town}</Text>
                    ) : null}

                    {/* ============== Postcode ==========*/}

                    <Text style={styles.inpLabel}>Postcode</Text>
                    <TextInput
                      id="postcode"
                      style={styles.inp}
                      placeholder="Enter postcode"
                      underlineStyle={{
                        display: 'none',
                      }}
                      outlineStyle={{
                        borderRadius: 20,
                      }}
                      autoCapitalize="characters"
                      onChangeText={handleChange('postcode')}
                      onBlur={handleBlur('postcode')}
                      value={values.postcode.toUpperCase()}
                    />
                    {errors.postcode && touched.postcode ? (
                      <Text style={styles.errorText}>{errors.postcode}</Text>
                    ) : null}

                    {/* ============== Country ==========*/}

                    <Text style={styles.inpLabel}>Country</Text>
                    <TextInput
                      id="country"
                      style={styles.inp}
                      placeholder="Enter country"
                      underlineStyle={{
                        display: 'none',
                      }}
                      outlineStyle={{
                        borderRadius: 20,
                      }}
                      onChangeText={handleChange('country')}
                      onBlur={handleBlur('country')}
                      value={values.country}
                    />
                    {errors.country && touched.country ? (
                      <Text style={styles.errorText}>{errors.country}</Text>
                    ) : null}

                    {/* ============== Region ==========*/}
                    <Text style={styles.inpLabel}>Region</Text>

                    <View
                      style={{ backgroundColor: '#e9dfed', borderRadius: 10 }}>
                      <Dropdown
                        style={{
                          height: 55,
                          borderRadius: 10,
                          paddingHorizontal: 8,
                          paddingStart: 15,
                        }}
                        containerStyle={{
                          backgroundColor: 'white',
                          borderRadius: 10,
                        }}
                        itemTextStyle={{
                          color: 'black',
                        }}
                        selectedTextStyle={{
                          color: 'black',
                        }}
                        ref={regionRef}
                        id="region"
                        data={sortedRegion}
                        dropdownPosition="top"
                        maxHeight={400}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Region"
                        searchPlaceholder="Search..."
                        value={values.region}
                        returnKeyType='next'
                        onFocus={() => {
                          handleBlur('region');
                          
                        }}
                        onBlur={() => {
                          handleBlur('region');
                        }}
                        onChange={item => {
                          setFieldValue('region', item.value);
                        }}
                      />
                    </View>
                    {errors.region && touched.region ? (
                      <Text style={styles.errorText}>{errors.region}</Text>
                    ) : null}

                    {stores?.length > 0 && (
                      <>
                        {/* ============== Nearest Bob & Berts Store ==========*/}
                        <Text style={styles.inpLabel}>
                          Nearest Bob & Berts Store
                        </Text>

                        <View
                          style={{
                            backgroundColor: '#e9dfed',
                            borderRadius: 10,
                          }}>
                          <Dropdown
                            style={{
                              height: 55,
                              borderRadius: 10,
                              paddingHorizontal: 8,
                              paddingStart: 15,
                            }}
                            containerStyle={{
                              backgroundColor: 'white',
                              borderRadius: 10,
                            }}
                            itemTextStyle={{
                              color: 'black',
                            }}
                            selectedTextStyle={{
                              color: 'black',
                            }}
                            ref={storeRef}
                            id="nearestStore"
                            data={
                              stores?.length > 0 &&
                              [...stores]
                                ?.sort((a, b) => b?.distance - a?.distance)
                                ?.filter(
                                  f => values.region === f?.regions?.name,
                                )
                                ?.map(store => {
                                  // return store;
                                  console.log(store, 86);
                                  return {
                                    label: `${store?.store_name}`,
                                    value: store?._id,
                                    fullText: `${store?.store_name}|${store?.distance}`,
                                  };
                                })
                            }
                            search
                            renderItem={item => {
                              console.log(item, 455335);
                              return (
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    height: 50,
                                    padding: 10,
                                  }}>
                                  <Text style={styles.storeName}>
                                    {item.fullText.split('|')[0]}
                                  </Text>
                                  <Text style={styles.distanceText}>
                                    {`${parseFloat(
                                      item.fullText.split('|')[1],
                                    ).toFixed(2)} miles`}
                                  </Text>
                                </View>
                              );
                            }}
                            maxHeight={400}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Nearest store"
                            searchPlaceholder="Search..."
                            value={values.nearestStore}
                            onFocus={() => {
                              handleBlur('nearestStore');
                            }}
                            onBlur={() => {
                              handleBlur('nearestStore');
                            }}
                            onChange={item => {
                              // console.log(item)
                              setFieldValue('nearestStore', item?.value);
                            }}
                          />
                        </View>
                        {errors.nearestStore && touched.nearestStore ? (
                          <Text style={styles.errorText}>
                            {errors.nearestStore}
                          </Text>
                        ) : null}
                      </>
                    )}

                    <Button
                      mode="contained"
                      labelStyle={styles.labelStyle}
                      onPress={handleSubmit}
                      style={styles.btnNext}>
                      Next
                    </Button>
                  </View>
                );
              }}
            </Formik>
          </KeyboardAwareScrollView>
        </KeyboardAvoidingView>
      ) : (
        <NoInternet />
      )}
    </>
  );
};

export default Register;

const styles = StyleSheet.create({
  textRegisterView: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  textRegister: {
    fontFamily: 'CircularStd-Bold',
    color: 'white',
    fontSize: 30,
  },
  inpGrp: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  inpLabel: {
    color: 'white',
    marginBottom: 5,
    marginTop: 10,
  },
  inp: {
    borderRadius: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    // marginTop:10
  },
  errorText: {
    color: '#F6A917',
    marginTop: 5,
  },
  btnNext: {
    marginTop: 20,
    marginBottom: 10,
    height: 50,
    justifyContent: 'center',
    borderRadius: 10,
  },
  labelStyle: {
    fontSize: 20,
  },
  storeName: {
    fontSize: 18,
  },
  distanceText: {},
});
