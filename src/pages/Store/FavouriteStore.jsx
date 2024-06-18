import {
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Text, Divider} from 'react-native-paper';
import React, {useCallback, useRef, useMemo, useEffect, useState} from 'react';
import StoreEachComponent from '../../components/StoreEachComponent';
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {imgSrc} from '../../assets/imgSrc';
import {
  addToFav,
  fetchFavStore,
  removeFromFav,
} from '../../redux/slices/favStoreSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {addToFavStore} from '../../api/api';
import {environment} from '../../environments/environment';

const FavouriteStore = () => {
  // hooks
  const sheetRef = useRef();
  const dispatch = useDispatch();
  const [store, setStore] = useState();
  const user = useSelector(state => state.currentUser.user);
  const favStores = useSelector(state => state.favStores.favStores);
  const stores = useSelector(state => state.stores.stores) || [];
  const delOpts = useSelector(state => state.delOpts.delOpts);

  // console.log(stores, 38);

  const favStoresIds =
    favStores?.stores?.length > 0 && favStores?.stores.map(store => store._id);

  const filteredFavoriteStores =
    stores.length &&
    favStoresIds.length &&
    stores?.filter(store => favStoresIds?.includes(store._id));

    console.log(filteredFavoriteStores,392)

  // variables
  const snapPoints = useMemo(() => ['25%', '50%', '80%'], []);
  // callbacks
  const handleSheetChange = useCallback(index => {
    console.log('handleSheetChange', index);
  }, []);

  const handleSnapPress = useCallback((index, value) => {
    console.log(value, index, 97);
    sheetRef.current?.snapToIndex(index);
    setStore(value);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchFav = async () => {
        dispatch(fetchFavStore(user._id));
      };
      fetchFav();
    }, []),
  );
  const dayName = new Date().toLocaleDateString('en-US', {weekday: 'long'});

  const openMap = (lat, lng) => {
    const scheme = Platform.select({
      ios: 'maps://0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${lat},${lng}`;
    const label = store?.store_name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  };

  return (
    <View style={{flex: 1, backgroundColor: '#5387C6'}}>
      {/* <ScrollView style={{backgroundColor: '#5387C6'}}>
        {favStores?.stores?.length > 0 &&
          [...favStores?.stores]
            ?.sort((a, b) => a?.distance - b?.distance)
            .map(store => (
              <View key={store['_id']}>
                <StoreEachComponent openSheet={handleSnapPress} store={store} />
              </View>
            ))}
      </ScrollView> */}

      <ScrollView style={{backgroundColor: '#5387C6'}}>
        {favStores?.stores?.length > 0 &&
          filteredFavoriteStores
            ?.sort((a, b) => a?.distance - b?.distance)
            .map(store => (
              <View key={store['_id']}>
                <StoreEachComponent openSheet={handleSnapPress} store={store} />
              </View>
            ))}
      </ScrollView>

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
        enablePanDownToClose>
        {/* <BottomSheetView style={styles.bottomSheetView}> */}
        <BottomSheetScrollView style={styles.bottomSheetView}>
          <View style={styles.header}>
            <View>
              <Text variant="titleLarge" style={styles.storeTitle}>
                {store?.store_name}
              </Text>

              <Text>
                {`Open until ${
                  store?.store_hours?.find(hrs => hrs?.day === dayName)
                    .closing_hours
                }`}
              </Text>
            </View>
            <Pressable
              onPress={async () => {
                favStores?.stores?.find(f => f._id === store?._id)
                  ? dispatch(removeFromFav(store?._id))
                  : dispatch(addToFav(store));
                await addToFavStore({user_id: user._id, store_id: store?._id});
                dispatch(fetchFavStore(user._id));

                // dispatch(addToFav(store));
              }}>
              <Ionicons
                name={
                  favStores?.stores?.find(f => f._id === store?._id)
                    ? 'heart-sharp'
                    : 'heart-outline'
                }
                color="#F6A917"
                size={30}
              />
            </Pressable>
            {/* <Ionicons name="heart-outline" color="#F6A917" size={30} /> */}
          </View>
          <Divider />
          <View style={styles.addressView}>
            <Text variant="titleMedium" style={styles.storeAddress}>
              {`${store?.store_address}, ${store?.store_postcode}`}
            </Text>
            <Pressable
              onPress={() => {
                openMap(store?.store_latitude, store?.store_longitude);
              }}>
              <MaterialIcons name="directions" color="#F6A917" size={30} />
            </Pressable>
          </View>
          <View style={styles.storeHoursView}>
            <Text variant="titleMedium" style={styles.storeHours}>
              Store Hours
            </Text>
            {store?.store_hours?.map(m => (
              <View key={m?.day} style={styles.times}>
                <Text>{m?.day}</Text>
                <View style={{flexDirection: 'row'}}>
                  <Text>{m?.opening_hours} - </Text>
                  <Text>{m?.closing_hours}</Text>
                </View>
              </View>
            ))}
          </View>
          {store?.store_in_delivery_options?.length > 0 && (
            <View style={styles.deliveryView}>
              <Text variant="titleMedium" style={[styles.storeHours,{marginBottom:7}]}>
                Delivery Available
              </Text>

              <View style={styles.deliveryOptionsGrp}>
                {store?.store_in_delivery_options?.map(m =>
                  delOpts
                    .filter(f => m.delivery_option_id === f._id)
                    .map(s => (
                      <Pressable
                        key={s?._id}
                        onPress={() => {
                          Linking.openURL(m?.custom_url);
                        }}>
                        <Image
                          key={s._id}
                          source={{
                            uri: `${environment.url}uploads/deliveryOption/${s?.delivery_option_image}`,
                          }}
                          style={{height: 40, width: 40}}
                          resizeMode="contain"
                        />
                      </Pressable>
                    )),
                )}
              </View>
            </View>
          )}
        </BottomSheetScrollView>
        {/* </BottomSheetView> */}
      </BottomSheet>
    </View>
  );
};

export default FavouriteStore;

const styles = StyleSheet.create({
  bottomSheetView: {
    paddingHorizontal: 20,
  },
  header: {
    height: 80,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeTitle: {
    fontFamily: 'CircularStd-Bold',
  },
  addressView: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeAddress: {
    width: '70%',
  },
  storeHoursView: {
    padding: 10,
  },
  storeHours: {
    fontFamily: 'CircularStd-Bold',
  },
  times: {
    width: '60%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  deliveryView: {
    padding: 10,
  },
  deliveryOptionsGrp: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
});
