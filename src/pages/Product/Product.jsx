import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import RewardPointsComponent from '../../components/RewardPointsComponent';
import {textFormatter} from '../../environments/formatter';
import RewardEachComponent from '../../components/RewardEachComponent';
import ProductEachComponent from '../../components/ProductEachComponent';
import {imgSrc} from '../../assets/imgSrc';

const Product = () => {
  const data = [
    {
      id: 1,
      img: imgSrc.board,
      title: 'Gildan Adult Ultra Cotton T-Shirt, Style G2000, Multipack',
      price: '49.59',
    },
    {
      id: 2,
      img: imgSrc.glass,
      title: 'Adult Ultra Cotton T-Shirt, Style G350',
      price: '29.60',
    },
    {
      id: 3,
      img: imgSrc.glass2,
      title: 'Ultra Cotton T-Shirt, Style F5000, Multipack',
      price: '79.20',
    },
    {
      id: 4,
      img: imgSrc.glass_free,
      title: 'Gildan Adult Ultra Cotton T-Shirt, Style G2000, Multipack',
      price: '49.59',
    },
    {
      id: 5,
      img: imgSrc.glass,
      title: 'Adult Ultra Cotton T-Shirt, Style G350,',
      price: '29.60',
    },
  ];

  return (
    <ScrollView style={{display: 'flex', backgroundColor: '#5387C6'}}>
      <View style={{marginBottom: 20}}>
        <RewardPointsComponent progress={0.75} />
      </View>

      {data.map(m => (
        <View key={m.id}>
          <ProductEachComponent data={m} />
        </View>
      ))}
    </ScrollView>
  );
};

export default Product;

const styles = StyleSheet.create({});
