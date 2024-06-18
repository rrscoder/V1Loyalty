import {Dimensions, Image, Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import {environment} from '../environments/environment';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Text} from 'react-native-paper';
import {textFormatter} from '../environments/formatter';
import {useNavigation} from '@react-navigation/native';
const { height: screenHeight } = Dimensions.get('window');
// const imageHeight = screenHeight * 0.15; 
// console.log("imageHeight",imageHeight);

const RedeemedEachComponent = ({data}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('RedeemConfirmModal', data)}
      activeOpacity={0.9}
      style={styles.container}>
      <View style={styles.left}>
        <Image
          source={{
            uri: `${environment.url}/uploads/mproduct/${data?.product?.product_image}`,
          }}
          resizeMode="cover"
          style={
            styles.image
          }
        />
      </View>

      <View
        style={{
          position: 'absolute',
          backgroundColor: '#F6A917',
          height: 25,
          width: 70,
          top: 0,
          right: 0,
          borderTopEndRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: 'white',
            fontFamily: 'CircularStd-Bold',
            fontSize: 13,
          }}>
          CLAIMED
        </Text>
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

export default RedeemedEachComponent;

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
  }
});
