import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Text, TextInput} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {secureEmailFormatter} from '../../../environments/formatter';
import {Formik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { environment } from '../../../environments/environment';

const ResetPWSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('Current Password is required')
    .min(8, 'Current Password should have minimum of 8 character'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[a-z]/, 'Password must contain a lowercase letter')
    .matches(/[A-Z]/, 'Password must contain an uppercase letter')
    .matches(/\d/, 'Password must contain a number')
    .matches(
      /[!@#$%^&*_]/,
      'Password must contain a special character (#?!@$%^&*_)',
    )
    .required('New Password is required'),
  cnfPassword: Yup.string()
    .min(8, 'Password should be min of 8')
    .oneOf(
      [Yup.ref('newPassword'), null],
      `Confirm Password doesn't match with New Password`,
    )
    .required('Confirm Password is required'),
});

const ResetPassword = ({navigation}) => {
  const [showCPW, setShowCPW] = useState(false);
  const [showNPW, setShowNPW] = useState(false);
  const [showCoPW, setShowCoPW] = useState(false);
  // const [isMailSend, setIsEmailSend] = useState(false);
  // const [sentMailRes, setSentMailRes] = useState(null);
  const user = useSelector(state => state.currentUser.user);

  const resetPassword = async values => {
    const data = await axios.post(
      environment.baseURL+'/change-user-pwd',
      values,
    );
     console.log("data",data);

    if (data.data?.success) {
      navigation.navigate('ConfirmationModal', {
        title: `${data.data?.msg}`,
      });
    } else {
      navigation.navigate('ErrorModal', {
        title: `${data.data?.msg}`,
      });
    }
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#5387C6'}}>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>
            Reset Password
          </Text>

          <Formik
            initialValues={{
              currentPassword: '',
              newPassword: '',
              cnfPassword: '',
            }}
            onSubmit={async values => {
              resetPassword({...values, user_id: user?._id});
            }}
            validationSchema={ResetPWSchema}>
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              /* and other goodies */
            }) => (
              <View style={{width: '100%'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    marginBottom: 5,
                    marginTop: 10,
                  }}>
                  <Text style={styles.inpLabel}>Current Password</Text>
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
                <TextInput
                  id="currentPassword"
                  secureTextEntry={showCPW ? false : true}
                  style={styles.inp}
                  placeholder="Enter Current Password"
                  underlineStyle={{
                    display: 'none',
                  }}
                  outlineStyle={{
                    borderRadius: 20,
                  }}
                  onChangeText={handleChange('currentPassword')}
                  onBlur={handleBlur('currentPassword')}
                  value={values.currentPassword}
                  right={
                    <TextInput.Icon
                      icon={showCPW ? 'eye' : 'eye-off'}
                      onPress={() => {
                        setShowCPW(!showCPW);
                      }}
                    />
                  }
                />
                {errors.currentPassword && touched.currentPassword ? (
                  <Text style={styles.errorText}>{errors.currentPassword}</Text>
                ) : null}

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    marginBottom: 5,
                    marginTop: 10,
                  }}>
                  <Text style={styles.inpLabel}>New Password</Text>
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
                <TextInput
                  id="newPassword"
                  secureTextEntry={showNPW ? false : true}
                  style={styles.inp}
                  placeholder="Enter New Password"
                  underlineStyle={{
                    display: 'none',
                  }}
                  outlineStyle={{
                    borderRadius: 20,
                  }}
                  onChangeText={handleChange('newPassword')}
                  onBlur={handleBlur('newPassword')}
                  value={values.newPassword}
                  right={
                    <TextInput.Icon
                      icon={showNPW ? 'eye' : 'eye-off'}
                      onPress={() => {
                        setShowNPW(!showNPW);
                      }}
                    />
                  }
                />
                {errors.newPassword && touched.newPassword ? (
                  <Text style={styles.errorText}>{errors.newPassword}</Text>
                ) : null}

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    marginBottom: 5,
                    marginTop: 10,
                  }}>
                  <Text style={styles.inpLabel}>Confirm Password</Text>
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
                <TextInput
                  id="cnfPassword"
                  secureTextEntry={showCoPW ? false : true}
                  style={styles.inp}
                  placeholder="Confirm New Password"
                  underlineStyle={{
                    display: 'none',
                  }}
                  outlineStyle={{
                    borderRadius: 20,
                  }}
                  onChangeText={handleChange('cnfPassword')}
                  onBlur={handleBlur('cnfPassword')}
                  value={values.cnfPassword}
                  right={
                    <TextInput.Icon
                      icon={showCoPW ? 'eye' : 'eye-off'}
                      onPress={() => {
                        setShowCoPW(!showCoPW);
                      }}
                    />
                  }
                />
                {errors.cnfPassword && touched.cnfPassword ? (
                  <Text style={styles.errorText}>{errors.cnfPassword}</Text>
                ) : null}

                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Button
                    mode="contained"
                    labelStyle={styles.labelStyle}
                    style={styles.sendBtn}
                    onPress={navigation.goBack}>
                    CANCEL
                  </Button>
                  <Button
                    mode="contained"
                    labelStyle={styles.labelStyle}
                    style={styles.sendBtn}
                    onPress={handleSubmit}>
                    UPDATE
                  </Button>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </ScrollView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  title: {
    fontFamily: 'CircularStd-Bold',
    color: 'white',
    fontSize: 30
  },
  subTitle: {
    fontFamily: 'CircularStd-Book',
    color: 'white',
    marginTop: 10,
    fontSize: 18,
    letterSpacing: 0.5,
  },
  sendBtn: {
    marginTop: 20,
    marginBottom: 10,
    height: 50,
    justifyContent: 'center',
    borderRadius: 10,
    width: '49%',
  },
  labelStyle: {
    fontSize: 20,
  },
  inpLabel: {
    color: 'white',
  },
  inp: {
    width: '100%',
    borderRadius: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    // marginTop:10
  },
  errorText: {
    color: '#F6A917',
    marginTop: 5,
  },
});
