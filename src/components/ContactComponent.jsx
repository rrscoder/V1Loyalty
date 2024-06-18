import {Linking, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {useSelector} from 'react-redux';

const ContactComponent = ({withBackground}) => {
  const settings = useSelector(state => state.settings.setting);

  return (
    <>
      <View style={withBackground ? styles.contactWB : styles.contact}>
        <Text
          style={
            withBackground
              ? styles.contactHeaderTextWB
              : styles.contactHeaderText
          }>
          Keep up with us on
        </Text>
        <View style={styles.contactLogos}>
          <Ionicons
            name="logo-instagram"
            size={30}
            color={withBackground ? '#5387C6' : 'white'}
            onPress={() => {
              Linking.openURL(settings?.instagram_link);
            }}
          />
          <FontAwesome6
            name="x-twitter"
            size={30}
            color={withBackground ? '#5387C6' : 'white'}
            onPress={() => {
              Linking.openURL(settings?.x_link);
            }}
          />
          <Ionicons
            name="logo-facebook"
            size={30}
            color={withBackground ? '#5387C6' : 'white'}
            onPress={() => {
              Linking.openURL(settings?.facebook_link);
            }}
          />
          <Ionicons
            name="logo-tiktok"
            size={30}
            color={withBackground ? '#5387C6' : 'white'}
            onPress={() => {
              Linking.openURL(settings?.tiktok_link);
            }}
          />
        </View>
      </View>
    </>
  );
};

export default ContactComponent;

const styles = StyleSheet.create({
  contact: {
    gap: 15,
    marginBottom: 20,
  },
  contactHeaderText: {
    fontFamily: 'CircularStd-Bold',
    fontSize: 25,
    textAlign: 'center',
    color: 'white',
  },
  contactLogos: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  //   WB ==> With Background
  contactWB: {
    gap: 15,
    marginTop: 20,
    // marginHorizontal: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
  },
  contactHeaderTextWB: {
    fontFamily: 'CircularStd-Bold',
    fontSize: 25,
    textAlign: 'center',
    color: '#5387C6',
  },
});
