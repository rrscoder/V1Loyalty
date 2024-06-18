import {ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import {Button, Text, TextInput} from 'react-native-paper';
import CheckoutProductEachComponent from '../../components/CheckoutProductEachComponent';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {RegistrationSchema} from '../Register/Register1';
import {Dropdown} from 'react-native-element-dropdown';
import {useSelector} from 'react-redux';
import {collectReward} from '../../api/api';

const BillingSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('First Name is required')
    .min(3, 'First name should have minimum of 3 character'),
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .min(10, 'Number should have minimum of 10 digits')
    .max(11, 'Number should have maximum of 11 digits'),
  address1: Yup.string().required('Address 1 is required'),
  // address2: Yup.string().required('Address 2 is required'),
  town: Yup.string().required('Town is required'),
  postcode: Yup.string().required('Postcode is required'),
  country: Yup.string().required('Country is required'),
});

const Checkout = ({navigation, route}) => {
  const user = useSelector(state => state.currentUser.user);
  const reward = route.params;

  const redeemReward = async values => {
    const data = await collectReward(values);

    if (data?.success) {
      navigation.navigate('ConfirmationModal', {
        title: 'You’re points have been successfully redeemed.',
        extra: {
          title: 'Your reward is on it’s way!',
          subTitle: 'Check your email for order details.',
        },
      });
    }
  };
  return (
    <ScrollView style={{flex: 1, backgroundColor: '#5387C6'}}>
      <View style={styles.container}>
        <Text
          style={{
            fontFamily: 'CircularStd-Bold',
            color: '#fff',
            fontSize: 25,
          }}>
          Your Order
        </Text>

        <CheckoutProductEachComponent data={reward} />

        <Formik
          initialValues={{
            fullName: `${user.firstName} ${user.lastName}`,
            phoneNumber: user.phoneNumber,
            address1: user.address1,
            address2: user?.address2 || '',
            town: user.town,
            postcode: user.postcode,
            country: user.country,
          }}
          onSubmit={values => {
            redeemReward({
              order_id: `BB${Date.now()}${user._id?.substring(
                user._id?.length - 5,
              )}`.toUpperCase(),
              user_id: user._id,
              reward_id: reward._id,
              product_id: reward.product_id,
              points_spent: reward?.reward_points
                ? reward?.reward_points
                : reward?.product?.product_point,
              ...values,
            });
          }}
          validationSchema={BillingSchema}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            touched,
            errors,
          }) => {
            return (
              <>
                <View style={styles.inpGrp}>
                  <Text
                    style={{
                      fontFamily: 'CircularStd-Bold',
                      color: '#fff',
                      fontSize: 25,
                    }}>
                    Contact Details
                  </Text>
                  {/* ============== First Name ==========*/}
                  <Text style={styles.inpLabel}>Full Name</Text>
                  <TextInput
                    id="fullName"
                    style={styles.inp}
                    placeholder="John"
                    underlineStyle={{
                      display: 'none',
                    }}
                    outlineStyle={{
                      borderRadius: 20,
                    }}
                    onChangeText={handleChange('fullName')}
                    onBlur={handleBlur('fullName')}
                    value={values.fullName}
                  />
                  {errors.fullName && touched.fullName ? (
                    <Text style={styles.errorText}>{errors.fullName}</Text>
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
                  />
                  {errors.phoneNumber && touched.phoneNumber ? (
                    <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                  ) : null}

                  <Text
                    style={{
                      fontFamily: 'CircularStd-Bold',
                      color: '#fff',
                      fontSize: 25,
                      marginTop: 10,
                    }}>
                    Address
                  </Text>

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

                  <Text style={styles.inpLabel}>
                    Address Line 2 ( Optional )
                  </Text>
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

                  {/* ============== Postcode ==========*/}

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{width: '49%'}}>
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
                      />
                      {errors.postcode && touched.postcode ? (
                        <Text style={styles.errorText}>{errors.postcode}</Text>
                      ) : null}
                    </View>

                    {/* ============== Town ==========*/}
                    <View style={{width: '49%'}}>
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
                    </View>
                  </View>

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

                  <Button
                    mode="contained"
                    labelStyle={styles.labelStyle}
                    onPress={handleSubmit}
                    style={styles.btnNext}>
                    Confirm Your Order
                  </Button>
                </View>
              </>
            );
          }}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  inpGrp: {
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
});
