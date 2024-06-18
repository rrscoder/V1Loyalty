import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {Text} from 'react-native-paper';
import {imgSrc} from '../assets/imgSrc';
import {environment} from '../environments/environment';

const ReawardRedeemedEachComponent = ({data}) => {
  const date = new Date(data?.created_at);
  const formattedDate = date.toLocaleDateString('en-GB');

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View>
          <Image
            source={{
              uri: `${environment.url}/uploads/mproduct/${data?.product?.product_image}`,
            }}
            resizeMode="contain"
            style={{
              height: 80,
              width: 80,
              borderRadius: 10,
            }}
          />
        </View>
        <View>
          <View style={{width: '88%'}}>
            <Text
              style={{
                fontFamily: 'CircularStd-Bold',
                color: '#5387C6',
                fontSize: 22,
              }}>
              {`${data?.reward?.reward_name}`}
            </Text>
          </View>
          <View>
            <Text>{formattedDate}</Text>
          </View>
        </View>
      </View>
      <View style={styles.right}>
        <Text
          style={{
            fontFamily: 'CircularStd-Bold',
            fontSize: 30,
            color: '#F6A917',
          }}>
          {`${data?.points_spent}`}
        </Text>
        <Text
          style={{
            fontFamily: 'CircularStd-Bold',
            // fontSize: 30,
          }}>
          pts
        </Text>
      </View>
    </View>
  );
};

export default ReawardRedeemedEachComponent;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    width: '80%',
    alignItems: 'center',
    // backgroundColor: 'red',
    gap: 10
  },
  right: {
    width: '20%',
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingRight: 5
  },
});
