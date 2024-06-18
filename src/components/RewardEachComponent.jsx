
import { Image, StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
import React from 'react';
import { Text } from 'react-native-paper';
import { textFormatter } from '../environments/formatter';
import { useNavigation } from '@react-navigation/native';
import { environment } from '../environments/environment';
import { useSelector } from 'react-redux';
import { imgSrc } from '../assets/imgSrc';

const RewardEachComponent = ({ data }) => {
  const navigation = useNavigation();
  const user = useSelector(state => state.currentUser.user);

  return (
    <TouchableOpacity
      onPress={() =>
        user?.status === '0'
          ? navigation.navigate('ErrorModal', {
            title: `Verify Your Email !`,
            extra: {
              title: '',
              subTitle:
                'Please verify your email to access your rewards and offers.',
            },
          })
          : navigation.navigate('RedeemConfirmModal', data)
      }
      activeOpacity={0.9}
      style={styles.container}>
      <View style={styles.left}>
        <Image
          source={
            data?.product?.product_image
              ? {
                uri: `${environment.url}/uploads/mproduct/${data?.product?.product_image}`,
              }
              : imgSrc.no_image
          }
          resizeMode='cover'
          style={styles.image}
        />
      </View>
      <View style={styles.right}>
        <Text style={styles.rewardTitle} numberOfLines={2}>
          {textFormatter(`${data?.product?.product_name}`, 27)}
        </Text>
        <Text style={styles.rewardPoints}>
          {data?.reward_points
            ? `${data?.reward_points} PTS`
            : `${data?.product?.product_point} PTS`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RewardEachComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 30,
    marginVertical: 5,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  left: {
    width: '40%',
    height: 135,
    alignItems: 'center',
    backgroundColor: '#e6e6e6',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    overflow: 'hidden', // Ensure the image doesn't overflow the rounded corners
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  right: {
    width: '60%',
    margin: 20,
    paddingRight: 20,
  },
  rewardTitle: {
    fontSize: Platform.OS === 'android' ? 17 : 18,
    fontFamily: 'CircularStd-Bold',
    color: '#5387C6',
    overflow: 'hidden',
  },
  rewardPoints: {
    fontSize: 15,
    fontFamily: 'CircularStd-Book',
  },
});
