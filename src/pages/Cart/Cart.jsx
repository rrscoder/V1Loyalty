import {ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import ProductEachComponent from '../../components/ProductEachComponent';
import {useSelector} from 'react-redux';
import LottieView from 'lottie-react-native';
import {imgSrc} from '../../assets/imgSrc';
import {Button, Text} from 'react-native-paper';

const Cart = ({navigation}) => {
  const carts = useSelector(state => state.carts.carts);
  return (
    <ScrollView style={{flex: 1, backgroundColor: '#5387C6'}}>
      {carts.length === 0 ? (
        <View
          style={{
            flex: 1,
          }}>
          <LottieView
            style={{
              height: 500,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            source={imgSrc.emptyCartAni}
            autoPlay
            loop
          />
          <Text
            variant="headlineLarge"
            style={{
              textAlign: 'center',
              fontSize: 30,
              fontFamily: 'CircularStd-Bold',
              color: 'white',
            }}>
            Your cart is empty!
          </Text>
          <Button
            mode="contained"
            style={{marginHorizontal: 30, marginVertical: 30}}
            onPress={()=>{
                navigation.navigate('Product')
            }}
            >
            Go to Product
          </Button>
        </View>
      ) : (
        <View>
          {carts.map(m => (
            <View key={m.id}>
              <ProductEachComponent data={m} from="Cart" />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default Cart;

const styles = StyleSheet.create({});
