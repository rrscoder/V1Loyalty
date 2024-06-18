import {Image, ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import {imgSrc} from '../../assets/imgSrc';
import {Text} from 'react-native-paper';

const ProductDetails = () => {
  return (
    <ScrollView style={{display: 'flex', backgroundColor: '#5387C6'}}>
      <View>
        <View style={{backgroundColor: 'white', alignItems: 'center'}}>
          <Image
            source={imgSrc.glass}
            style={{height: 300}}
            resizeMode="contain"
          />
        </View>
        <View style={{marginHorizontal: 20, marginVertical: 20}}>
          <Text variant="labelLarge" style={styles.productTitle}>
            Adult Ultra Cotton T-Shirt, Style G350
          </Text>

          <Text variant="displayMedium" style={styles.productPrice}>
            $44.89
          </Text>

          <Text style={styles.productDescription}>
            It's made of 100% cotton, and comes in a variety of colors. The
            Gildan Ultra Cotton Tee has a seamless double-needle 2.2 cm collar,
            taped neck and shoulders, and double needle sleeves and bottom hems
            for extra durability.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  productTitle: {
    fontSize: 22,
    fontFamily: 'CircularStd-Bold',
    color: '#F6A917',
  },
  productPrice: {
    // fontSize: 22,
    fontFamily: 'CircularStd-Bold',
    color: 'white',
  },
  productDescription: {
    fontSize: 16,
    fontFamily: 'CircularStd-Book',
    color: 'white',
    textAlign:'justify'
  },
});
