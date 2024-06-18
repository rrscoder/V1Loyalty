import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {imgSrc} from '../../assets/imgSrc';
import {Button} from 'react-native-paper';

const LoginOrRegistration = ({navigation}) => {
  return (
    <View style={{flex: 1, backgroundColor: '#5387C6'}}>
      <View style={styles.container}>
        <Image
          source={imgSrc.bb_hi}
          style={{width: 200, height: 200}}
          resizeMode="contain"
        />
        <View style={{width:'100%'}}>
          <Button
            mode="contained"
            style={styles.btn}
            labelStyle={styles.labelStyle}
            onPress={() => {
              navigation.navigate('Login');
            }}>
            Login
          </Button>
          <Button
            mode="contained"
            style={styles.btn}
            labelStyle={styles.labelStyle}
            onPress={() => {
              navigation.navigate('Register');
            }}>
            Register
          </Button>
        </View>
      </View>
    </View>
  );
};

export default LoginOrRegistration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap:20
  },
  btn: {
    width: '100%',
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
