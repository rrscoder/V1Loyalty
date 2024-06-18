import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {allClaimedRewardByUser} from '../../api/api';
import {useSelector} from 'react-redux';
import ReawardRedeemedEachComponent from '../../components/ReawardRedeemedEachComponent';
import {ActivityIndicator} from 'react-native-paper';

const RewardEarned = () => {
  const user = useSelector(state => state.currentUser.user);
  const [allRewards, setAllRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const rewards = await allClaimedRewardByUser({user_id: user._id});
      setAllRewards(rewards?.claimedRewards);
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
      <View>
        {allRewards?.length > 0 ? (
          allRewards?.map(m => (
            <View key={m._id}>
              <ReawardRedeemedEachComponent data={m} />
            </View>
          ))
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              margin: 20,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'CircularStd-Bold',
                color: 'white',
              }}>
              You haven’t earned any rewards yet!
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default RewardEarned;

const styles = StyleSheet.create({});
