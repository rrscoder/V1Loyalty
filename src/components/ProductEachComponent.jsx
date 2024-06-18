import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {Image} from 'react-native';
import {textFormatter} from '../environments/formatter';
import {imgSrc} from '../assets/imgSrc';
import {Button} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {addToCart, removeToCart} from '../redux/slices/cartSlice';

const ProductEachComponent = ({data, from = ''}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const state = useSelector(state => state.carts);

  return (
    <Pressable
      onPress={() => navigation.navigate('ProductDetails')}
      activeOpacity={0.9}
      style={styles.container}>
      <View style={styles.left}>
        <Image
          source={data.img}
          resizeMode="contain"
          style={{
            height: 100,
            width: 100,
          }}
        />
      </View>
      <View style={styles.right}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {textFormatter(data.title, 40)}
        </Text>
        <Text style={styles.productPrice} numberOfLines={2}>
          £{textFormatter(data.price, 40)}
        </Text>

        {from ? (
          <Button
            mode="contained"
            style={styles.addToCartBtn}
            onPress={() => {
              dispatch(removeToCart(data.id));
            }}>
            Remove from Cart
          </Button>
        ) : (
          <Button
            mode="contained"
            style={styles.addToCartBtn}
            onPress={() => {
              dispatch(addToCart(data));
            }}>
            Add to Cart
          </Button>
        )}
      </View>
    </Pressable>
  );
};

export default ProductEachComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 30,
    marginVertical: 5,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  left: {
    width: '30%',
    alignItems: 'center',
    backgroundColor: '#e6e6e6',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    paddingVertical: 20,
  },
  right: {
    width: '70%',
    margin: 10,
    paddingRight: 20,
    gap: 10,
  },
  productTitle: {
    fontSize: 20,
    fontFamily: 'CircularStd-Bold',
    color: '#5387C6',
    // color: '#000',
    overflow: 'hidden',
  },
  productPrice: {
    fontSize: 25,
    fontFamily: 'CircularStd-Bold',
    // color: '#5387C6',
    color: '#000',
    overflow: 'hidden',
  },
  productPoints: {
    fontSize: 15,
    fontFamily: 'CircularStd-Bold',
    // color: '#5387C6',
    color: '#000',
    overflow: 'hidden',
  },
  addToCartBtn: {
    borderRadius: 10,
  },
});
