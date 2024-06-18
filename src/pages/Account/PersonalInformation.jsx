import { ScrollView, StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setItemToLocal, updateUserProfile } from '../../api/api';
import { updateCurrUser } from '../../redux/slices/userSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { showToast } from '../../utils/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { allStores } from '../../redux/slices/storeSlice';
import { getAllRegion, getAllStores, isUserExist } from '../../api/api';
import { Dropdown } from 'react-native-element-dropdown';
import { calculateDistance, countryData, getLatLong } from '../../utils/Utils';

const RegistrationSchema = Yup.object()
  .shape({
    firstName: Yup.string()
      .required('First Name is required')
      .min(3, 'Name should have minimum of 3 character'),
    lastName: Yup.string()
      .min(3, 'Name should have minimum of 3 character')
      .required('Last Name is required'),
    email: Yup.string()
      .email('Must be a valid email')
      .required('Email is required'),
    phoneNumber: Yup.string()
      .required('Phone number is required')
      .min(10, 'Number should have minimum of 10 digits and maximum of 11 digits')
      .max(11, 'Number should have maximum of 11 digits'),
    day: Yup.number()
      .min(1, 'Day must be between 1 and 31')
      .max(31, 'Day must be between 1 and 31'),
    month: Yup.number()
      .min(1, 'Month must be between 1 and 12')
      .max(12, 'Month must be between 1 and 12'),
    year: Yup.number()
      .min(1900, 'Year must be after 1900')
      .max(
        new Date().getFullYear(),
        'Year must be before or equal to current year',
      ),
    address1: Yup.string().required('Address 1 is required'),
    town: Yup.string().required('Town is required'),
    country: Yup.string().required('Country is required'),
    nearestStore: Yup.string().required('Nearest Store is required'),
    postcode: Yup.string()
    .required('Required')
    .min(5, 'Postcode must be at least 5 characters')
    .max(9, 'Postcode must be at most 9 characters'),
  })
  .test('valid-date', 'Invalid date', function (value) {
    // return false
    const { day, month, year } = value;

    // Check if the date is valid
    const isValidDate = !isNaN(Date.parse(`${year}-${month}-${day}`));
    if (!isValidDate) {
      return false;
    }

    // Check if the day is valid for the given month and year
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) {
      return false;
    }
    return true;
  });

const PersonalInformation = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.currentUser.user);
  const dispatch = useDispatch();
  const regions = useSelector(state => state.region.region);
  const stores = useSelector(state => state.stores.stores);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        style={{ backgroundColor: '#5387C6' }}
        contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.textRegisterView}>
          <Text style={styles.textRegister}>
            Personal Information
          </Text>
        </View>

        <Formik
          initialValues={{
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.email,
            phoneNumber: user?.phoneNumber,
            day: user?.dob?.split('-')[2],
            month: user?.dob?.split('-')[1],
            year: user?.dob?.split('-')[0],
            address1: user?.address1,
            address2: user?.address2 || '',
            town: user?.town,
            postcode: user?.postcode,
            country: user?.country,
            nearestStore: user?.nearestStore,

          }}
          onSubmit={async values => {
            const userData = await updateUserProfile({
              ...values,
              _id: user['_id'],
            });
            setItemToLocal('currentUser', userData?.data);
            dispatch(updateCurrUser(userData?.data));
            navigation.navigate('ConfirmationModal', {
              title: `You’re contact preferences have been successfully updated!`,
            });
          }}
          validationSchema={RegistrationSchema}>
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
              const fetchLatLongIfNeeded = async () => {
                if (
                  values.address1 &&
                  values.town &&
                  values.country &&
                  values.postcode
                ) {
                  // try {
                    const latLong = await getLatLong(
                      // ${ values.address1 }, ${ values.town }, ${ values.postcode },
                      `${values.address1}, ${values.town}, ${values.postcode}`,
                    );

                    const getAllStore = async () => {

                      const stores = await getAllStores();
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
                      dispatch(allStores(addDistance));
                      // setLoading(false);
                    };

                    getAllStore();
                  // } catch (error) {
                  //   console.log('Error fetching lat/long:', error);
                  // }
                } else {
                  console.log('something is not provided');
                }
              };
              fetchLatLongIfNeeded();
            }, [
              values.address1,
              values.town,
              values.postcode,
              values.country,
            ]);
            return (
              <View style={styles.inpGrp}>
                {/* ============== First Name ==========*/}
                <Text style={styles.inpLabel}>First Name</Text>
                <TextInput
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
                />
                {errors.firstName && touched.firstName ? (
                  <Text style={styles.errorText}>{errors.firstName}</Text>
                ) : null}
                {/* ============== Last Name ==========*/}
                <Text style={styles.inpLabel}>Last Name</Text>
                <TextInput
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
                />
                {errors.lastName && touched.lastName ? (
                  <Text style={styles.errorText}>{errors.lastName}</Text>
                ) : null}
                {/* ============== Email ==========*/}
                <Text style={styles.inpLabel}>Email</Text>
                <TextInput
                  id="email"
                  style={[styles.inp, { backgroundColor: '#ccc7' }]}
                  disabled
                  placeholder="johndoe@gmail.com"
                  underlineStyle={{
                    display: 'none',
                  }}
                  outlineStyle={{
                    borderRadius: 20,
                  }}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  right={
                    user?.status === '1' && (
                      <TextInput.Icon
                        icon={() => (
                          <Ionicons
                            name="checkmark-circle"
                            size={22}
                            color="#057317"
                          />
                        )}
                      />
                    )
                  }
                />
                {errors.email && touched.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
                {/* ============== Phone Number ==========*/}
                <Text style={styles.inpLabel}>Phone Number</Text>
                <TextInput
                  id="phoneNumber"
                  style={styles.inp}
                  placeholder="6679592364"
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
                    id="day"
                    style={[
                      styles.inp,
                      { width: '30%', backgroundColor: '#ccc7' },
                    ]}
                    placeholder="dd"
                    disabled
                    textColor="#0007"
                    underlineStyle={{
                      display: 'none',
                    }}
                    outlineStyle={{
                      borderRadius: 20,
                    }}
                    keyboardType="numeric"
                    onChangeText={handleChange('day')}
                    onBlur={handleBlur('day')}
                    value={values.day}
                  />
                  <Text style={{ fontSize: 40, color: 'white' }}>-</Text>
                  <TextInput
                    id="month"
                    style={[
                      styles.inp,
                      { width: '30%', backgroundColor: '#ccc7', color: 'red' },
                    ]}
                    placeholder="mm"
                    disabled
                    textColor="#0007"
                    underlineStyle={{
                      display: 'none',
                    }}
                    outlineStyle={{
                      borderRadius: 20,
                    }}
                    keyboardType="numeric"
                    onChangeText={handleChange('month')}
                    onBlur={handleBlur('month')}
                    value={values.month}
                  />
                  <Text style={{ fontSize: 40, color: 'white' }}>-</Text>
                  <TextInput
                    id="year"
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
                  />
                </View>
                {(errors.day && touched.day) ||
                  (errors.month && touched.month) ||
                  (errors.year && touched.year) ? (
                  <Text style={styles.errorText}>
                    {errors.day && touched.day
                      ? errors.day
                      : errors.month && touched.month
                        ? errors.month
                        : errors.year && touched.year
                          ? errors.year
                          : ''}
                  </Text>
                ) : null}
                {/* <Text style={styles.errorText}>
                {errors.day && touched.day
                  ? errors.day
                  : errors.month && touched.month
                  ? errors.month
                  : errors.year && touched.year
                  ? errors.year
                  : ''}
              </Text> */}
                {/* ============== Address Line 1 ==========*/}
                <Text style={styles.inpLabel}>Address Line 1</Text>
                <TextInput
                  id="address1"
                  style={styles.inp}
                  placeholder="Enter Address Line 1"
                  underlineStyle={{
                    display: 'none',
                  }}
                  outlineStyle={{
                    borderRadius: 20,
                  }}
                  onChangeText={handleChange('address1')}
                  onBlur={handleBlur('address1')}
                  value={values.address1}
                />
                {errors.address1 && touched.address1 ? (
                  <Text style={styles.errorText}>{errors.address1}</Text>
                ) : null}
                {/* ============== Address Line 2 ==========*/}
                <Text style={styles.inpLabel}>Address Line 2 ( Optional )</Text>
                <TextInput
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
                <Text style={styles.inpLabel}>Town/City</Text>
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
                  onChangeText={handleChange('postcode')}
                  onBlur={handleBlur('postcode')}
                  value={values.postcode}
                  maxLength={9} 
                  
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
                        id="nearestStore"
                        data={
                          stores?.length > 0 &&
                          [...stores]
                            ?.sort((a, b) => b?.distance - a?.distance)
                            // ?.filter(
                            //   f => values.region === f?.regions?.name,
                            // )
                            ?.map(store => {
                              return {
                                label: `${store?.store_name}`,
                                value: store?._id,
                                fullText: `${store?.store_name}|${store?.distance}`,
                              };
                            })
                        }
                        search
                        renderItem={item => {
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
                <View style={styles.btnGrp}>
                  <Button
                    mode="contained"
                    labelStyle={styles.labelStyle}
                    onPress={navigation.goBack}
                    style={styles.btnNext}>
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    // disabled={!dirty}
                    labelStyle={styles.labelStyle}
                    onPress={handleSubmit}
                    style={styles.btnNext}>
                    Update
                  </Button>
                </View>
              </View>
            );
          }}
        </Formik>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView >
  
  );
};

export default PersonalInformation;

const styles = StyleSheet.create({
  textRegisterView: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  textRegister: {
    fontFamily: 'CircularStd-Bold',
    color: 'white',
    fontSize: 30,
    
  },
  inpGrp: {
    marginHorizontal: 20,
    marginBottom: 10,
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
    width: '45%',
    justifyContent: 'center',
    borderRadius: 10,
  },
  labelStyle: {
    fontSize: 20,
  },
  btnGrp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
