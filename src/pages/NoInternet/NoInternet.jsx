import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const NoInternet = () => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="wifi-off" color="#5387C6" size={40} />
      <Text style={styles.text}>No Internet Connections</Text>
    </View>
  );
};

export default NoInternet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap:10
  },
  text: {
    fontFamily: 'CircularStd-Bold',
    fontSize: 20,
  },
});
