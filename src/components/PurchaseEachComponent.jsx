import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {imgSrc} from '../assets/imgSrc';
import {Text} from 'react-native-paper';
import {environment} from '../environments/environment';

const PurchaseEachComponent = ({data}) => {
  const date = new Date(data?.created_at);
  const formattedDate = date.toLocaleDateString('en-GB');

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.date}>{formattedDate}</Text>
        <View style={styles.pointsGrp}>
          <Text style={styles.points}>{data?.stamps}</Text>
          <Text>{ parseInt(data?.stamps) <= 1 ?`Stamp` : 'Stamps'}</Text>
        </View>
        <View style={styles.pointsGrp}>
          <Text style={styles.points}>{data?.points}</Text>
          <Text>{ parseInt(data?.points) <= 1 ?`Point` : 'Points'}</Text>
        </View>
      </View>
      <View>
        <Text
          style={{
            fontFamily: 'CircularStd-Bold',
            fontSize: 20,
            // color: '#5387C6',
          }}>
          Balance:
        </Text>
        <View style={[styles.pointsGrp, {justifyContent: 'center'}]}>
          <Text
            style={{
              fontFamily: 'CircularStd-Bold',
              fontSize: 30,
              color: '#F6A917',
            }}>
            {data?.balancePoints}
          </Text>
          <Text>PTS</Text>
        </View>
      </View>
    </View>
  );
};

export default PurchaseEachComponent;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    fontFamily: 'CircularStd-Bold',
    fontSize: 22,
    color: '#5387C6',
  },
  pointsGrp: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  points: {
    fontSize: 20,
  },
});
