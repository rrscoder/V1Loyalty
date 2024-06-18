import { Formik } from 'formik';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Switch,
  Pressable,
  Linking,
  Platform,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { register, setItemToLocal, updateUserProfile } from '../../api/api';
import { showToast } from '../../utils/Utils';
import * as RootNavigation from '../../navigation/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrUser } from '../../redux/slices/userSlice';

const ContactPreferences = ({ navigation, route }) => {
  // const navigation = useNavigation()

  const { comingFrom, registerFormData } = route.params;

  const user = useSelector(state => state.currentUser.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  return (
    <ScrollView style={{ display: 'flex', backgroundColor: '#5387C6' }}>
      <View style={styles.container}>
        <Text
          style={Platform.OS === 'ios' ? styles.titleIOS : styles.title}>
          Contact Preferences
        </Text>
        <Text
          variant="titleLarge"
          style={[
            styles.subTitle,
            {
              // marginTop: 10,
              lineHeight: 21,
              marginBottom: 10, marginTop: -2
            },
          ]}>
          Keep up to date with Bob & Berts by updating your contact
          preferences.
        </Text>
        {/* <Text style={[styles.title, { marginBottom: -20, marginTop: 20 }]}>Contact Me</Text>
        <Text variant="titleLarge" style={[styles.subTitle, { lineHeight: 21 }]}>
          Get the lowdown on newness at Bob & Berts special offers! 
        </Text> */}

        <Formik
          initialValues={{
            allowEmailNotification: user?.allowEmailNotification || false,
            allowPushNotifications: user?.allowPushNotifications || false,
            // allowMarketingUpdates: user?.allowMarketingUpdates || false,
            allowTermandCondition: user?.allowTermandCondition || false,
            allowPrivacyPolice: user?.allowPrivacyPolice || false,


          }}
          onSubmit={async values => {
            setLoading(true);
            // this onSubmit is for registerinf user. Check onPress for other button
            const user = await register({ ...registerFormData, ...values });

            if (user?.success) {
              await setItemToLocal('currentUser', user?.data);

              await setItemToLocal('registerFreeCoffeeAlert', true);
              await setItemToLocal('birthDayFreeCoffeeAlert', true);

              // showToast('success', 'Success!', user?.message);
              setLoading(false);

              navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
              });
            } else {
              setLoading(false);
              navigation.navigate('ErrorModal', { title: `${user?.message}` });
              // showToast('error', 'Error!', user?.message);
            }
          }}>
          {({
            values,
            setFieldValue,
            dirty,
            handleSubmit,
            /* and other goodies */
          }) => (
            <View>
              <View style={styles.notifyOptions}>
              <View style={{marginTop:-10}}>
                <Text style={styles.subTitle}>
                I wish to receive:
                </Text>
              </View>

                <View style={styles.notifyOptionEach}>
                  <Text style={styles.notifyText}>Email</Text>
                  <Switch
                    trackColor={{ false: '#ccc', true: '#81b0ff' }}
                    thumbColor={
                      values.allowEmailNotification ? '#F6A917' : '#f4f3f4'
                    }
                    value={values.allowEmailNotification}
                    onValueChange={v =>
                      setFieldValue('allowEmailNotification', v)
                    }
                  />
                </View>
                <View style={[styles.notifyOptionEach, { marginTop: -5 }]}>
                  <Text style={styles.notifyText}>Push Notification</Text>
                  
                  <Switch
                    trackColor={{ false: '#ccc', true: '#81b0ff' }}
                    thumbColor={
                      values.allowPushNotifications ? '#F6A917' : '#f4f3f4'
                    }
                    value={values.allowPushNotifications}
                    onValueChange={v =>
                      setFieldValue('allowPushNotifications', v)
                    }
                  />
                </View>
                {/* {comingFrom === 'Register' && (
                  <View style={styles.notifyOptionEach}>
                    <Text style={styles.notifyText}>
                      I agree to receive regular emails on promotions, updates
                      and news from Bob & Bert's App
                    </Text>
                    <Switch
                      trackColor={{ false: '#ccc', true: '#81b0ff' }}
                      thumbColor={
                        values.allowMarketingUpdates ? '#F6A917' : '#f4f3f4'
                      }
                      value={values.allowMarketingUpdates}
                      onValueChange={v =>
                        setFieldValue('allowMarketingUpdates', v)
                      }
                    />
                  </View>
                )} */}
              </View>
              <View>
                {comingFrom === 'Register' ? (
                  <View>
                    <Pressable
                      style={{ marginTop: 20 }}
                      onPress={() => {
                        Linking.openURL(
                          'https://bobandberts.co.uk/privacy-policy/',
                        );
                      }}>
                      <Text
                        // variant="headlineLarge"
                        style={
                          Platform.OS === 'ios' ? styles.titleIOS : styles.title
                        }>
                        Terms & Conditions
                      </Text>
                      <View style={styles.termandconditionview}>
                        <View>
                          <Text variant="titleLarge" style={[styles.subTitle, { marginTop: -5 }]}>
                            I agree to the terms & conditions
                          </Text>
                          <Text
                            variant="bodySmall"
                            style={[styles.subTitle, { fontSize: 18, marginTop: 2 }]}>
                            Read more
                          </Text>
                        </View>
                        <View style={{ marginRight: -11 }}>
                          <Switch
                            trackColor={{ false: '#ccc', true: '#81b0ff' }}
                            thumbColor={
                              values.allowTermandCondition ? '#F6A917' : '#f4f3f4'
                            }
                            value={values.allowTermandCondition}
                            onValueChange={v =>
                              setFieldValue('allowTermandCondition', v)
                            }
                          />
                        </View>
                      </View>
                    </Pressable>
                    <Pressable
                      style={{ marginTop: 20 }}
                      onPress={() => {
                        Linking.openURL(
                          'https://bobandberts.co.uk/privacy-policy/',
                        );
                      }}>
                      <Text
                        // variant="headlineLarge"
                        style={
                          Platform.OS === 'ios' ? styles.titleIOS : styles.title
                        }>
                        Privacy Policy
                      </Text>
                      <View style={styles.privacyPolicy}>

                        <View>
                          <Text variant="titleLarge" style={[styles.subTitle, { marginTop: -5 }]}>
                            I agree to the privacy policy
                          </Text>
                          <Text
                            variant="bodySmall"
                            style={[styles.subTitle, { fontSize: 18, marginTop: 2 }]}>
                            Read more
                          </Text>
                        </View>
                        <View style={{ marginRight: -11 }}>
                          <Switch
                            trackColor={{ false: '#ccc', true: '#81b0ff' }}
                            thumbColor={
                              values.allowPrivacyPolice ? '#F6A917' : '#f4f3f4'
                            }
                            value={values.allowPrivacyPolice}
                            onValueChange={v =>
                              setFieldValue('allowPrivacyPolice', v)
                            }
                          />
                        </View>
                      </View>
                    </Pressable>
                    <Button
                      mode="contained"
                      labelStyle={styles.labelStyle}
                      contentStyle={styles.contentStyle}
                      onPress={handleSubmit}
                      style={styles.btnNext}
                      loading={loading}
                      // disabled={loading}
                      disabled={loading || !values.allowTermandCondition || !values.allowPrivacyPolice}
                    >
                      <Text style={{ color: 'white' }}>
                        {loading ? 'Creating your account...' : 'Register'}
                      </Text>
                    </Button>
                  </View>
                ) : (
                  <Button
                    mode="contained"
                    disabled={!dirty}
                    labelStyle={styles.labelStyle}
                    contentStyle={styles.contentStyle}
                    onPress={async () => {
                      const userData = await updateUserProfile({
                        ...values,
                        _id: user['_id'],
                      }).then(res => {
                        setItemToLocal('currentUser', res?.data);
                        dispatch(updateCurrUser(res?.data));
                        navigation.navigate('ConfirmationModal', {
                          title: `Your contact preferences have been successfully updated!`,
                        });
                      });
                    }}
                    style={styles.btnNext}>
                    CONFIRM CHANGES
                  </Button>
                )}
              </View>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default ContactPreferences;

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
  titleIOS: {
    fontFamily: 'CircularStd-Bold',
    color: 'white',
    fontSize: 30
  },
  subTitle: {
    fontFamily: 'CircularStd-Book',
    color: 'white',
    marginTop: 20,
    fontSize: 18,
    letterSpacing: 0.5,
  },
  notifyOptions: {
    marginTop: 8,
    gap: 20,
  },
  notifyOptionEach: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    //  marginTop:-5
    marginRight: 8
  },
  notifyText: {
    fontSize: 20,
    color: 'white',
    width: '90%',
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
  termandconditionview: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignSelf: 'center', alignItems: 'center' },
  privacyPolicy: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignSelf: 'center', alignItems: 'center' },

});
