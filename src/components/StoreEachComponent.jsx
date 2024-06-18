import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToFav,
  fetchFavStore,
  removeFromFav,
} from '../redux/slices/favStoreSlice';
import { addToFavStore } from '../api/api';
import { calculateDistance } from '../utils/Utils';

const StoreEachComponent = props => {
  const { store, fromPage, focusOnStore } = props;
  const dispatch = useDispatch();

  const favStores = useSelector(state => state.favStores.favStores);
  const user = useSelector(state => state.currentUser.user);

  return (
    <Pressable
      style={
        fromPage === 'SearchPage'
          ? [
            styles.container,
            {
              padding: 10,
              borderRadius: 5,
              backgroundColor: 'white',
            },
          ]
          : styles.container
      }
      activeOpacity={1}
      onPress={() => {
        // props.openSheet(1, store);
        props.focusOnStore(store);

      }}
    >
      <View style={styles.left}>
        <Text variant="titleMedium" style={styles.title}>
          {store?.store_name}
        </Text>
        {/* <Text variant="titleMedium" style={styles.address}>
          {store?.store_address}
        </Text> */}
        <Text
          style={
            styles.distance
          }>{`${store.distance} miles away from you`}</Text>
      </View>
      <View style={styles.iconGrp}>
        <Pressable
          onPress={async () => {
            favStores?.stores?.find(f => f._id === store._id)
              ? dispatch(removeFromFav(store._id))
              : dispatch(addToFav(store));
            await addToFavStore({ user_id: user._id, store_id: store._id });
            dispatch(fetchFavStore(user._id));

            // dispatch(addToFav(store));
          }}>
          <Ionicons
            name={
              favStores?.stores?.find(f => f._id === store._id)
                ? 'heart-sharp'
                : 'heart-outline'
            }
            color="#F6A917"
            size={30}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            props.openSheet(1, store);
          }}>
          <Ionicons
            name="information-circle-outline"
            color="#F6A917"
            size={30}
          />
        </Pressable>
      </View>
    </Pressable>
  );
};

export default StoreEachComponent;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    padding: 10,
  },
  left: {
    width: '80%',
  },
  iconGrp: {
    // width:'30%',
    flexDirection: 'row',
    gap: 5,
  },
  title: {
    // color: '#5387C6',
    color: 'black',
    fontFamily: 'CircularStd-Bold',
  },
  address: {
    color: 'gray',
    letterSpacing: 0.2,
    fontFamily: 'CircularStd-Book',
  },
  distance: {
    fontFamily: 'CircularStd-Book',
  },
});

