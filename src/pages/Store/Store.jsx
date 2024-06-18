import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import StoreEachComponent from '../../components/StoreEachComponent';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useDispatch, useSelector} from 'react-redux';
import {addToFavStore, getAllStores} from '../../api/api';
import {calculateDistance} from '../../utils/Utils';
import {allStores} from '../../redux/slices/storeSlice';
import {useFocusEffect} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {
  addToFav,
  fetchFavStore,
  removeFromFav,
} from '../../redux/slices/favStoreSlice';
import {Divider, Text} from 'react-native-paper';
import {Image} from 'react-native';
import {environment} from '../../environments/environment';
import {imgSrc} from '../../assets/imgSrc';

const Store = () => {
  const sheetRef = useRef();
  const sheetRef2 = useRef();
  const dispatch = useDispatch();
  const mapRef = useRef(null);

  const [store, setStore] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState('Local');

  const user = useSelector(state => state.currentUser.user);
  const stores = useSelector(state => state.stores.stores) || [];
  const favStores = useSelector(state => state.favStores.favStores);
  const delOpts = useSelector(state => state.delOpts.delOpts);
  const currLocation = useSelector(state => state.currLocation.currLocation);

  const [btS1, setBTS1] = useState(true);
  const [btS2, setBTS2] = useState(false);

  const favStoresIds =
    favStores?.stores?.length > 0 && favStores?.stores.map(store => store._id);

  const filteredFavoriteStores =
    stores.length &&
    favStoresIds.length &&
    stores?.filter(store => favStoresIds?.includes(store._id));

    const snapPoints = useMemo(() => {
      return Platform.OS === 'ios' ? ['32%', '80%'] : ['32%', '80%'];
    }, []);
  const snapPoints2 = useMemo(() => ['80%','80%'], []);

  const handleSheetChange = useCallback(index => {
    console.log('handleSheetChange', index);
  }, []);

  const handleSnapPress = useCallback((index, value) => {
    setStore(value);
    setBTS2(true);
    sheetRef2.current?.snapToIndex(index);
    console.log('clips');
  }, []);

  const focusOnStore = (store) => {
    mapRef.current.animateToRegion({
      latitude: parseFloat(store.store_latitude),
      longitude: parseFloat(store.store_longitude),
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000);
  };

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
        currLocation?.latitude && currLocation?.longitude
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

  const storeLatLng =
    stores.length > 0 &&
    stores.map(s => ({
      title: `${s?.store_name} - ${s?.distance} miles away from you.`,
      latitude: parseFloat(s?.store_latitude),
      longitude: parseFloat(s?.store_longitude),
    }));

  // console.log(storeLatLng, 445);
  // console.log(currLocation, 255);

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

  const mapStyle = [
    {
      featureType: 'poi.business',
      elementType: 'labels.text.fill',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'poi.business',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <MapView
       ref={mapRef}
        customMapStyle={mapStyle}
        // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={{
          latitude: currLocation?.latitude
            ? currLocation?.latitude
            : 54.6361523,
          longitude: currLocation?.longitude
            ? currLocation?.longitude
            : -2.8817033,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        {storeLatLng.length &&
          storeLatLng.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.title}>
              <View style={{width: 50, height: 50}}>
                <Image
                  source={imgSrc.store_location_pin}
                  style={{width: '100%', height: '100%'}}
                  resizeMode="contain"
                />
              </View>
            </Marker>
          ))}

        {(currLocation?.latitude || currLocation?.longitude) && (
          <Marker
            coordinate={{
              latitude: currLocation?.latitude,
              longitude: currLocation?.longitude,
            }}
            title="You are here"></Marker>
        )}
      </MapView>

      {btS1 && (
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          onChange={handleSheetChange}>
          <BottomSheetView style={styles.header1}>
            <Pressable
              onPress={() => {
                setSelected('Local');
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: selected === 'Local' ? '#5387C6' : '#a2a2a2',
                  fontFamily: 'CircularStd-Bold',
                }}>
                Local
              </Text>
              {selected === 'Local' && (
                <Divider style={{height: 2, backgroundColor: '#5387C6'}} />
              )}
            </Pressable>
            <Pressable
              onPress={() => {
                setSelected('Favourites');
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: selected === 'Favourites' ? '#5387C6' : '#a2a2a2',
                  fontFamily: 'CircularStd-Bold',
                }}>
                Favourites
              </Text>
              {selected === 'Favourites' && (
                <Divider style={{height: 2, backgroundColor: '#5387C6'}} />
              )}
            </Pressable>
          </BottomSheetView>
          {loading && (
            <View
              style={{
                flex: 1,
              }}>
              <ActivityIndicator color="#5387C6" size={30} />
            </View>
          )}
          {selected === 'Local' && (
            <BottomSheetScrollView>
              {stores.length > 0 &&
                [...stores]
                  ?.sort((a, b) => a?.distance - b?.distance)
                  .map(store => (
                    <View key={store['_id']}>
                      <StoreEachComponent
                        openSheet={handleSnapPress}
                        store={store}
                        focusOnStore={focusOnStore}
                      />
                    </View>
                  ))}
            </BottomSheetScrollView>
          )}
          {selected === 'Favourites' && (
            <BottomSheetScrollView>
              {favStores?.stores?.length > 0 &&
                filteredFavoriteStores
                  ?.sort((a, b) => a?.distance - b?.distance)
                  .map(store => (
                    <View key={store['_id']}>
                      <StoreEachComponent
                        openSheet={handleSnapPress}
                        store={store}
                        focusOnStore={focusOnStore}
                      />
                    </View>
                  ))}
            </BottomSheetScrollView>
          )}
        </BottomSheet>
      )}

      {btS2 && (
        <BottomSheet
          ref={sheetRef2}
          // index={-1}
          snapPoints={snapPoints2}
          enablePanDownToClose
          // onChange={handleSheetChange}
        >
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
            <Pressable
              onPress={() => {
                openMap(store?.store_latitude, store?.store_longitude);
              }}>
              <View style={styles.addressView}>
                <Text variant="titleMedium" style={styles.storeAddress}>
                  {`${store?.store_address}, ${store?.store_postcode}`}
                </Text>

                <MaterialIcons name="directions" color="#F6A917" size={30} />
              </View>
            </Pressable>
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
              <View style={[styles.deliveryView,]}>
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
        </BottomSheet>
      )}
    </View>
  );
};

export default Store;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    marginTop: -50,
  },
  bottomSheetView: {
    paddingHorizontal: 20,
    
  },
  header1: {
    height: 30,
    paddingLeft: 30,
    flexDirection: 'row',
    gap: 20,
    elevation: 3,
    backgroundColor: 'white',
    
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
    // marginBottom:7
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
