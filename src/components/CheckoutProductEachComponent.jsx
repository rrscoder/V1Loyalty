import { Image, Pressable, StyleSheet, View } from 'react-native';
import React from 'react';
import { imgSrc } from '../assets/imgSrc';
import { Text } from 'react-native-paper';
import { textFormatter } from '../environments/formatter';
import { useNavigation } from '@react-navigation/native';
import { environment } from '../environments/environment';

const CheckoutProductEachComponent = ({ data }) => {
  const navigation = useNavigation();
  return (
    <Pressable style={styles.container}>
      <View style={styles.left}>
        <View style={{ marginRight: 10 }}>
          <Image
            source={{
              uri: `${environment.url}/uploads/mproduct/${data?.product?.product_image}`,
            }}
            // source={imgSrc.glass_free}
            resizeMode="contain"
            style={{
              height: 80,
              width: 80,
              borderRadius: 10,
            }}
          />
        </View>
        <View style={{ width: '73%' }}>
          <View>
            <Text
              style={{
                fontFamily: 'CircularStd-Bold',
                color: '#5387C6',
                fontSize: 23,
                // fontSize: 25,
              }}>
              {/* {textFormatter(`${data?.product?.product_name}`, 20)} */}
              {data?.product?.product_name}
            </Text>
          </View>
          <View>
            <Text>
              {textFormatter(`${data?.product?.product_description}`, 80)}
            </Text>
          </View>
        </View>
      </View>
      <View style={[styles.right]}>
        <View>
          <Text
            style={{
              fontFamily: 'CircularStd-Bold',
              fontSize: 28,
              color: '#F6A917',
            }}>
            {data?.reward_points}
          </Text>
        </View>
        <View >

          <Text
            style={{
              fontFamily: 'CircularStd-Bold',
              // fontSize: 30,
              marginHorizontal: 2,

            }}>
            pts
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default CheckoutProductEachComponent;

const styles = StyleSheet.create({
  container: {
    // marginHorizontal: 10,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10
  },
  left: {
    flexDirection: 'row',
    width: '80%',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  right: {
    width: '22%',
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginTop: 8,


    // backgroundColor:'green'
  },
});
