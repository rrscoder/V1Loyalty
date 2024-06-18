import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getAllPointsEarned} from '../../api/api';
import {useSelector} from 'react-redux';
import PurchaseEachComponent from '../../components/PurchaseEachComponent';
import {ActivityIndicator} from 'react-native-paper';

const Purchases = () => {
  const [allPurshases, setAllPurshases] = useState([]);
  const user = useSelector(state => state.currentUser.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const points = await getAllPointsEarned({user_id: user._id});
      setAllPurshases(points?.data);
      setLoading(false);
    };
    getData();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#5387C6',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator color="white" size={40} />
      </View>
    );
  }

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#5387c6'}}>
      <View style={{height: '100%'}}>
        {allPurshases?.length > 0 ? (
          allPurshases?.map(m => (
            <View key={m._id}>
              <PurchaseEachComponent data={m} />
            </View>
          ))
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 5,
              marginTop:20,
              width:'100%',
              alignContent:'center'
            }}>
            <Text
              style={{
                // textAlign: 'center',
                fontSize: 17,
                fontFamily: 'CircularStd-Bold',
                color: 'white',
              }}>
              You haven’t purchased any rewards yet!
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Purchases;

const styles = StyleSheet.create({});
