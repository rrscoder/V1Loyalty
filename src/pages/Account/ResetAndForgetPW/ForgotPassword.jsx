
import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Text, TextInput} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {secureEmailFormatter} from '../../../environments/formatter';
import {Formik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import { useNavigation } from '@react-navigation/native';

const ForgotPassword = () => {
  const [showPW, setShowPW] = useState(false);
  const [isMailSend, setIsEmailSend] = useState(false);
  const [sentMailRes, setSentMailRes] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const user = useSelector(state => state.currentUser.user);
  const navigation = useNavigation();

  const ResetPWSchema = Yup.object().shape({
    code: Yup.string()
      .required('Code is required')
      .max(6, 'Code must be of 6 character')
      .min(6, 'Code must be of 6 character'),
    password: Yup.string()
      .min(6, 'Password should have minimum of 6 character')
      .required('Password is required'),
    cnfPassword: Yup.string()
      .min(6, 'Password should be min of 6')
      .oneOf(
        [Yup.ref('password'), null],
        `Confirm Password doesn't match with Password`,
      )
      .required('Confirm Password is required'),
  });

  const SendCodeSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

  const sendCodeRequest = async email => {
    const data = await axios.post(
      environment.baseURL+'/send-code-for-pwd-reset',{email: email}
    );
    if (data?.data.success) {
      setIsEmailSend(true);
      setSentMailRes(data?.data);
      setUserEmail(email);
    } else{
      navigation.navigate('ErrorModal', {
        title: data?.data.msg
      });
    }
  };

  const resetPassword = async values => {
    const data = await axios.post(
      environment.baseURL+'/reset-user-password',
      values,
    );
    if(data?.data.success){
      navigation.goBack();
    } else{
      navigation.navigate('ErrorModal', {
        title: data?.data.msg
      });
    }
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#5387C6'}}>
      <View style={styles.container}>
        {isMailSend ? (
          <View>
            <Text variant="headlineLarge" style={styles.title}>
              Forgot Password
            </Text>
            {sentMailRes?.success && (
              <Text variant="titleLarge" style={styles.subTitle}>
                {sentMailRes?.msg}
              </Text>
            )}
            <Formik
              initialValues={{code: '', password: '', cnfPassword: ''}}
              onSubmit={async values => {
                resetPassword({
                  ...values,
                  email: userEmail,
                  //   email: 'abhijitdasgupta98@proton.me',
                });
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
                  <Text style={styles.inpLabel}>Code</Text>
                  <TextInput
                    id="code"
                    style={styles.inp}
                    placeholder="Enter 6-digit code"
                    underlineStyle={{
                      display: 'none',
                    }}
                    outlineStyle={{
                      borderRadius: 20,
                    }}
                    onChangeText={handleChange('code')}
                    onBlur={handleBlur('code')}
                    value={values.code}
                  />
                  {errors.code && touched.code ? (
                    <Text style={styles.errorText}>{errors.code}</Text>
                  ) : null}

                  <Text style={styles.inpLabel}>New Password</Text>
                  <TextInput
                    id="password"
                    secureTextEntry={showPW ? false : true}
                    style={styles.inp}
                    placeholder="Enter New Password"
                    underlineStyle={{
                      display: 'none',
                    }}
                    outlineStyle={{
                      borderRadius: 20,
                    }}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
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

                  <Text style={styles.inpLabel}>Confirm Password</Text>
                  <TextInput
                    id="cnfPassword"
                    style={styles.inp}
                    placeholder="Enter Confirm Password"
                    underlineStyle={{
                      display: 'none',
                    }}
                    outlineStyle={{
                      borderRadius: 20,
                    }}
                    onChangeText={handleChange('cnfPassword')}
                    onBlur={handleBlur('cnfPassword')}
                    value={values.cnfPassword}
                  />
                  {errors.cnfPassword && touched.cnfPassword ? (
                    <Text style={styles.errorText}>{errors.cnfPassword}</Text>
                  ) : null}

                  <Button
                    mode="contained"
                    labelStyle={styles.labelStyle}
                    style={styles.sendBtn}
                    onPress={handleSubmit}>
                    Reset Password
                  </Button>
                </View>
              )}
            </Formik>
          </View>
        ) : (
          <View>
            <Text variant="headlineLarge" style={styles.title}>
              Forgot Password ?
            </Text>

            <Text variant="titleLarge" style={styles.subTitle}>
              No worries! Please enter your registered email address below, and
              we'll send you a 6-digit verification code to reset your
              password.
            </Text>
            <Formik
              initialValues={{email: ''}}
              onSubmit={async values => {
                sendCodeRequest(values.email.toLowerCase());
              }}
              validationSchema={SendCodeSchema}>
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                /* and other goodies */
              }) => (
                <View style={{width: '100%',marginTop:10}}>
                  <Text style={styles.inpLabel}>Email</Text>
                  <TextInput
                    id="email"
                    style={styles.inp}
                    placeholder="Enter email"
                    underlineStyle={{
                      display: 'none',
                    }}
                    outlineStyle={{
                      borderRadius: 20,
                    }}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email.toLowerCase()}
                  />
                  {errors.email && touched.email ? (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  ) : null}

                  <Button
                    mode="contained"
                    labelStyle={styles.labelStyle}
                    onPress={handleSubmit}
                    style={styles.sendBtn}>
                    Send Code
                  </Button>
                </View>
              )}
            </Formik>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  title: {
    fontFamily: 'CircularStd-Bold',
    color: 'white',
    fontSize:28
  },
  subTitle: {
    fontFamily: 'CircularStd-Book',
    color: 'white',
    marginTop: 10,
    fontSize: 18,
    letterSpacing: 0.5,
    lineHeight: 23,
  },
  sendBtn: {
    borderRadius: 10,
    height: 50,
  },
  sendBtn: {
    marginTop: 20,
    marginBottom: 10,
    height: 50,
    justifyContent: 'center',
    borderRadius: 10,
  },
  labelStyle: {
    fontSize: 20,
  },
  inpLabel: {
    color: 'white',
    marginBottom: 5,
    marginTop: 10,
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
