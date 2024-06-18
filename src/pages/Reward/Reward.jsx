import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import RewardPointsComponent from '../../components/RewardPointsComponent';
import RewardEachComponent from '../../components/RewardEachComponent';
import {useDispatch, useSelector} from 'react-redux';
import {ActivityIndicator} from 'react-native';
import RedeemedEachComponent from '../../components/RedeemedEachComponent';
import {useFocusEffect} from '@react-navigation/native';
import {getAllRewards} from '../../api/api';
import {allRewards} from '../../redux/slices/rewardSlice';

const Reward = () => {
  const [loading, setLoading] = useState(true);
  const user = useSelector(state => state.currentUser.user);
  const rewards = useSelector(state => state.rewards.rewards);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      const getData = async () => {
        const rewards = await getAllRewards({user_id: user._id});
        dispatch(allRewards(rewards?.data));
        setLoading(false);
      };

      getData();
    }, []),
  );

  const claimedReward =
    rewards?.length > 0 && rewards?.filter(reward => reward.claimed === true);

  const notClaimed =
    rewards?.length > 0 &&
    rewards
      ?.filter(reward => reward.claimed === false)
      .map(m =>
        m?.reward_points
          ? {...m, reward_points: parseInt(m?.reward_points)}
          : {...m, reward_points: parseInt(m?.product?.product_point)},
      )
      .sort((a, b) => a.reward_points - b.reward_points);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#5387C6',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator color="white" size={40} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{
        display: 'flex',
        backgroundColor: '#5387C6',
        marginTop: -30,
        paddingTop: 30,
      }}>
      <View style={{marginBottom: 35}}>
        <View style={{marginBottom: 20}}>
          <RewardPointsComponent currUser={user} rewards={notClaimed[0]} />
        </View>

        {/* {rewards.length > 0 &&
        rewards.map(m => (
          <View key={m._id}>
            <RewardEachComponent data={m} />
          </View>
        ))} */}

        {/* show those reward which are not claimed */}
        {notClaimed.length > 0 &&
          notClaimed.map(m => (
            <View key={m._id}>
              <RewardEachComponent data={m} />
            </View>
          ))}

        {/* get claimed reward from order table */}

        {claimedReward.length > 0 &&
          claimedReward.map(m => (
            <View key={m._id}>
              <RedeemedEachComponent data={m} />
            </View>
          ))}
      </View>
    </ScrollView>
  );
};

export default Reward;

const styles = StyleSheet.create({});
