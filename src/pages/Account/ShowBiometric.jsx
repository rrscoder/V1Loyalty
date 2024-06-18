import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Button, Text} from 'react-native-paper';
import {loginWithBiometric} from '../../utils/BiometricUtils';
import {useSelector} from 'react-redux';
import {getCurrentUserFromLocal} from '../../api/api';

const ShowBiometric = ({navigation}) => {
  //   const user = useSelector(state => state.currentUser.user);

  return (
    <View style={{flex: 1, alignItems: 'center', marginTop: 100}}>
      <Text variant="headlineMedium" style={{fontFamily: 'CircularStd-Bold'}}>
        Your biometric is enabled
      </Text>
      <Text
        variant="titleMedium"
        style={{
          fontFamily: 'CircularStd-Book',
          fontSize: 20,
          marginVertical: 15,
        }}>
        Please verify your biometric to login
      </Text>
      <Button
        mode="contained"
        onPress={async () => {
          const user = await getCurrentUserFromLocal();
          const verified = await loginWithBiometric(user._id);
          if (verified === true) {
            navigation.reset({
              index: 0,
              routes: [{name: 'Main'}],
            });
            // navigation.navigate('Main');
          } else {
            navigation.reset({
              index: 0,
              routes: [{name: 'ShowBiometric'}],
            });
            // navigation.navigate('ShowBiometric');
          }
        }}>
        Verify
      </Button>
    </View>
  );
};

export default ShowBiometric;

const styles = StyleSheet.create({});
