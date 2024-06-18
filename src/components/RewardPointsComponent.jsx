import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Image } from 'react-native';
import { ProgressBar, Text } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { calRewardPntsAndProgress } from '../utils/Utils';

const RewardPointsComponent = props => {
  const { currUser, rewards } = props;


  const currPnts = currUser?.current_point;
  const rewardPnts = rewards?.reward_points;
  // const rewardPnts = null;


  const progress =
    rewardPnts && currPnts && parseFloat(currPnts / rewardPnts).toFixed(2) > 1
      ? 1
      : !rewardPnts || !currPnts
        ? 0
        : parseFloat(currPnts / rewardPnts).toFixed(2);

  return (
    <View style={styles.pointContainer}>
      <View style={styles.pointContainerTop}>
        <View>
          <Image
            style={{ height: 80, width: 70 }}
            source={require('../assets/glass.png')}
            resizeMode="contain"
          />
        </View>
        <View style={{ display: 'flex', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text variant="titleLarge" style={[styles.rewardPoint]}>
              Rewards Points
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
            <Text variant="displayLarge" style={styles.point}>
              {currPnts}
            </Text>
          </View>

        </View>

      </View>
      <View style={styles.pointview}>
        <Text style={styles.pointtext}>1 drink = 2 points</Text>
      </View>
      <View style={styles.pointProgressContainer}>
        <ProgressBar
          progress={progress ? parseFloat(progress) : 0}
          style={styles.progressBar}
          fillStyle={styles.progressBarFilStyle}
        />
        {rewardPnts ? (
          <Text variant="bodyLarge" style={[styles.progressBarSubtext,{fontSize:12}]}>
            {`${rewardPnts - currPnts <= 0
                ? 'Congrats! milestone reached, claim your reward'
                : `${rewardPnts - currPnts} points until next reward`
              } `}
          </Text>
        ) : (
          <Text variant="bodyLarge" style={styles.progressBarSubtext}>
            Congrats! You've redeemed all the rewards.
          </Text>
        )}
      </View>
    </View>
  );
};

export default RewardPointsComponent;

const styles = StyleSheet.create({
  pointContainer: {
    marginTop: 10,
    marginHorizontal: 20,
  },
  pointContainerTop: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 100,
  },
  rewardPoint: {
    fontFamily: 'CircularStd-Book',
    color: 'white',
  },
  point: {
    fontFamily: 'CircularStd-Bold',
    color: 'white',
  },
  pointProgressContainer: {
    marginHorizontal: 10,
  },
  progressBar: {
    height: 20,
    borderRadius: 50,
  },
  progressBarFilStyle: {
    borderRadius: 10,
    borderCurve: 10,
  },
  progressBarSubtext: {
    fontSize: 18,
    fontFamily: 'CircularStd-Book',
    color: 'white',
  },
  pointview:{marginLeft:15,marginBottom:5,marginTop:-5},
  pointtext:{color:'white'},
});
