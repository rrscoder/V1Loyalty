import {
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  View,
  ActivityIndicator,
  Image,
  FlatList,
} from 'react-native';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Divider, Searchbar, Text} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import StoreEachComponent from '../../components/StoreEachComponent';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {addToFavStore, getAllStores} from '../../api/api';
import {calculateDistance} from '../../utils/Utils';
import {allStores} from '../../redux/slices/storeSlice';
import {useFocusEffect} from '@react-navigation/native';
import {imgSrc} from '../../assets/imgSrc';
import {
  addToFav,
  fetchFavStore,
  removeFromFav,
} from '../../redux/slices/favStoreSlice';
import {environment} from '../../environments/environment';
const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // hooks
  const sheetRef = useRef();
  const dispatch = useDispatch();

  const [store, setStore] = useState('');
  const [loading, setLoading] = useState(true);

  const user = useSelector(state => state.currentUser.user);
  const stores = useSelector(state => state.stores.stores) || [];
  const favStores = useSelector(state => state.favStores.favStores);
  const delOpts = useSelector(state => state.delOpts.delOpts);

  const currLocation = useSelector(state => state.currLocation.currLocation);

  console.log(stores, 939);
  // variables
  const snapPoints = useMemo(() => ['25%', '50%', '80%'], []);

  // callbacks
  const handleSheetChange = useCallback(index => {
    console.log('handleSheetChange', index);
  }, []);

  const handleSnapPress = useCallback((index, value) => {
    setStore(value);
    sheetRef.current?.snapToIndex(index);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFav();
      getAllStore();
    }, []),
  );
  const fetchFav = async () => {
    dispatch(fetchFavStore(user._id));
  };

  const getAllStore = async () => {
    console.log('called');
    const stores = await getAllStores();

    const addDistance = stores?.data.map(store => ({
      ...store,
      distance:
        currLocation.latitude && currLocation.longitude
          ? parseFloat(
              calculateDistance(
                currLocation.latitude,
                currLocation.longitude,
                store?.store_latitude,
                store?.store_longitude,
                'miles',
              ).toFixed(2),
            )
          : parseFloat(
              calculateDistance(
                user?.user_latitude,
                user?.user_longitude,
                store?.store_latitude,
                store?.store_longitude,
                'miles',
              ).toFixed(2),
            ),
    }));
    dispatch(allStores(addDistance));
    setLoading(false);
  };

  const dayName = new Date().toLocaleDateString('en-US', {weekday: 'long'});

  if (loading) {
    return (
      <View style={{display: 'flex', flex: 1, backgroundColor: '#5387C6'}}>
        <ActivityIndicator color="white" size={40} />
      </View>
    );
  }

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
    <View style={styles.container}>
      <Searchbar
        placeholder="Search store..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={{marginVertical: 10, borderRadius: 10, marginHorizontal: 20}}
      />
      <FlatList
        data={
          stores?.length > 0 && searchQuery
            ? [...stores]
                ?.filter(store => {
                  return store?.store_name
                    .toLowerCase()
                    .includes(searchQuery?.toLowerCase());
                })
                .sort((a, b) => a?.distance - b?.distance)
            : [...stores]?.sort((a, b) => a?.distance - b?.distance)
        }
        renderItem={({item}) => (
          <View key={item['_id']}>
            <StoreEachComponent openSheet={handleSnapPress} store={item} fromPage='SearchPage'/>
          </View>
        )}
      />

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
                await addToFavStore({
                  user_id: user._id,
                  store_id: store?._id,
                });
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

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5387C6',
  },
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
