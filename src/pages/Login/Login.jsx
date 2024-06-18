import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Formik} from 'formik';
import {Button, TextInput} from 'react-native-paper';
import * as Yup from 'yup';
import {imgSrc} from '../../assets/imgSrc';
import {login, setItemToLocal} from '../../api/api';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {OneSignal} from 'react-native-onesignal';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Must be a valid email')
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  
  const [showPW, setShowPW] = useState(false);
  const navigation = useNavigation();
  const [isDeviceToken, setDeviceToken] = useState('');
  useEffect(() => {
    // const deviceId = OneSignal.User.pushSubscription.getPushSubscriptionToken();
    // console.log(deviceId, 787);
    const subId = OneSignal.User.pushSubscription.getPushSubscriptionId();
    setDeviceToken(subId);
  }, []);
  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <KeyboardAwareScrollView
        style={{backgroundColor: '#5387C6'}}
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps={'always'}>
        <View style={styles.container}>
          <Image
            source={imgSrc.bb_hi}
            style={{width: 200, height: 200, marginTop: 30}}
            resizeMode="contain"
          />
          <Formik
            initialValues={{email: '', password: '', token: isDeviceToken}}
            onSubmit={async values => {
              const user = await login(values);
              if (user?.success) {
                await setItemToLocal('currentUser', user?.data);
                navigation.reset({
                  index: 0,
                  routes: [{name: 'Main'}],
                });
              } else {
                navigation.navigate('ErrorModal', {
                  title: `Invalid credentials.`,
                  extra: {
                    title: '',
                    subTitle: 'Please try again.'
                  },
                });
              }
            }}
            validationSchema={LoginSchema}
            >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              /* and other goodies */
            }) => {
              useEffect(() => {
                // Update the token field when isDeviceToken state changes
                if (isDeviceToken) {
                  setFieldValue('token', isDeviceToken);
                }
              }, [isDeviceToken]);

              return (
                <View style={{width: '100%'}}>
                  <Text style={styles.inpLabel}>Email</Text>
                  <TextInput
                    id="email"
                    keyboardType="email-address"
                    style={styles.inp}
                    placeholder="Email"
                    underlineStyle={{
                      display: 'none',
                    }}
                    outlineStyle={{
                      borderRadius: 20,
                    }}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email.toLowerCase()}
                    returnKeyType="done"
                    returnKeyLabel="Done"
                  />
                  {errors.email && touched.email ? (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  ) : null}

                  <Text style={styles.inpLabel}>Password</Text>
                  <TextInput
                    id="password"
                    style={styles.inp}
                    placeholder="Password"
                    secureTextEntry={showPW ? false : true}
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

                  <Button
                    mode="contained"
                    labelStyle={styles.labelStyle}
                    onPress={handleSubmit}
                    style={styles.btnLogin}>
                    Login
                  </Button>
                </View>
              );
            }}
          </Formik>

          <View style={{alignSelf: 'flex-end'}}>
            <Text
              style={{fontSize: 18, color: 'white'}}
              onPress={() => navigation.navigate('ForgotPassword')}>
              Forgot Password ?
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>

    /* <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      style={{flex: 1, backgroundColor: '#5387C6'}}>

    </ScrollView> */
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 30,
    alignItems: 'center',
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
  btnLogin: {
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
