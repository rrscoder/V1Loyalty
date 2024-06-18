import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import React from 'react';
import {Text} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
const AccountEachComponent = props => {
  const {title, pages} = props;
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          Platform.OS === 'ios'
            ? {
                fontSize: 25,
                fontWeight: 'bold',
              }
            : {
                fontSize: 25
              },
        ]}>
        {title}
      </Text>
      {pages.map(m => (
        <TouchableOpacity
          activeOpacity={0.7}
          key={m?.pageName}
          style={styles.pagesEachRow}
          onPress={() => {
            m?.url
              ? Linking.openURL(m?.url)
              : navigation.navigate(m?.pageName, {comingFrom: m?.pageName});
          }}>
          <Text
            style={[
              styles.pages,
              Platform.OS === 'ios' ? {fontSize: 20} : {fontSize: 22},
            ]}>
            {m.pageTitle}
          </Text>
          {m?.icon ? (
            <Ionicons name={m?.icon} color="white" size={28} />
          ) : (
            <Ionicons name="chevron-forward-outline" color="white" size={30} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default AccountEachComponent;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  title: {
    fontFamily: 'CircularStd-Bold',
    color: 'white',
    marginBottom: 20,
    fontSize: 30,
  },
  pages: {
    fontFamily: 'CircularStd-Book',
    color: 'white',
  },
  pagesEachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});
