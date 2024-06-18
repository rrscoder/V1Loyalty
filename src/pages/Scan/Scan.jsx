import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import {Image} from 'react-native';
import {imgSrc} from '../../assets/imgSrc';
import {
  addRewardToUser,
  setItemToLocal,
  updateUserProfile,
} from '../../api/api';
import {updateCurrUser} from '../../redux/slices/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import {showToast} from '../../utils/Utils';

const Scan = ({navigation, route}) => {
  const keyName = route.params;
  const device = useCameraDevice('back');
  const user = useSelector(state => state.currentUser.user);
  const [isScanned, setIsScanned] = useState(false);
  const dispatch = useDispatch();

  const addScannerDetails = async values => {
    console.log(values, 62);
    setIsScanned(true);
    const pointData = await addRewardToUser({
      user_id: user['_id'],
      qr_res: values,
    });

    if (pointData?.status) {
       
      const userData = await updateUserProfile({
        qr_res: values,
        _id: user['_id'],
      });

      console.log(userData?.data, values, 898);
      setItemToLocal('currentUser', userData?.data);
      dispatch(updateCurrUser(userData?.data));
      navigation.navigate('Main');

      navigation.navigate('ConfirmationModal', {
        title: `${userData?.message}`,
        extra: {
          title: `You have just got ${values?.loyaltycounter} ${
            parseInt(values?.loyaltycounter) <= 1 ? 'stamp' : 'stamps'
          } and ${values?.loyaltycounter * 2} ${
            parseInt(values?.loyaltycounter * 2) <= 1 ? 'point' : 'points'
          }`,
          // subTitle: 'Check your email for verification and re-launch the app.',
        },
      });

      if (userData.data?.current_stamp >= 9) {
        navigation.navigate('ConfirmationModal', {
          title: `Congrats!`,
          extra: {
            title: `You have just got a free coffee from our side.`,
            // subTitle: 'Check your email for verification and re-launch the app.',
          },
        });
      }
    } else {
      // showToast('error', 'Already Claimed', pointData?.message);
      navigation.navigate('Main');

      navigation.navigate('ErrorModal', {
        title: `Sorry!`,
        extra: {
          title: `This code is either not valid or may have already been claimed.`,
          // subTitle: 'Check your email for verification and re-launch the app.',
        },
      });
    }
  };

  const handleClaimed = async key => {
    // navigation.replace('ShowQRModal');
    setIsScanned(true);

    if (!key) {
      navigation.navigate('Main');

      navigation.navigate('ErrorModal', {
        title: `Sorry!`,
        extra: {
          title: `This code is either not valid or may have already been claimed.`,
          // subTitle: 'Check your email for verification and re-launch the app.',
        },
      });
    }

    if (key === 'stampsFreeCoffeeClaimable') {
      const userData = await updateUserProfile({
        stampsFreeCoffeeClaimable: false,
        _id: user['_id'],
        current_stamp: 0,
      });
      console.log(userData?.data, 7872);
      setItemToLocal('currentUser', userData?.data);
      dispatch(updateCurrUser(userData?.data));

      navigation.replace('ConfirmationModal', {
        title: 'Congrats!',
        extra: {
          title: 'Your free coffee has been successfully redeemed.',
        },
      });
    } else if (key === 'birthDayFreeCoffeeClaimed') {
      const userData = await updateUserProfile({
        birthDayFreeCoffeeClaimed: true,
        _id: user['_id'],
      });
      console.log(userData?.data, 7873);

      setItemToLocal('currentUser', userData?.data);
      setItemToLocal('birthDayFreeCoffeeAlert', false);
      dispatch(updateCurrUser(userData?.data));

      navigation.replace('ConfirmationModal', {
        title: 'Congrats!',
        extra: {
          title: 'Your free coffee has been successfully redeemed.',
        },
      });
    } else if (key === 'registerFreeCoffeeClaimed') {
      const userData = await updateUserProfile({
        registerFreeCoffeeClaimed: true,
        _id: user['_id'],
      });
      console.log(userData?.data, 7874);
      setItemToLocal('currentUser', userData?.data);
      setItemToLocal('registerFreeCoffeeAlert', false);
      dispatch(updateCurrUser(userData?.data));

      navigation.replace('ConfirmationModal', {
        title: 'Congrats!',
        extra: {
          title: 'Your free coffee has been successfully redeemed.',
        },
      });
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      console.log(codes, 556);

      if (
        !isScanned &&
        codes[0].value !== 'FREEDRINK' &&
        (codes[0].value.includes('uniquesaleID') ||
          codes[0].value.includes('IDCuniquesaleID'))
      ) {
        const data = JSON.parse(codes[0].value);
        console.log(data, 371);

        //  addScannerDetails(JSON.parse(data));
        addScannerDetails(data);
      } else if (
        !isScanned &&
        typeof codes[0].value === 'string' &&
        codes[0].value === 'FREEDRINK'
      ) {
        handleClaimed(keyName);
      }
    },
  });

  if (device == null) return <ActivityIndicator />;

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        codeScanner={codeScanner}
        onError={() => {
          console.log('error');
        }}
      />
      <Image source={imgSrc.scanBoxBY} style={styles.middleBox} />
      {/* <View style={styles.middleBox}></View> */}
    </View>
  );
};

export default Scan;

const styles = StyleSheet.create({
  middleBox: {
    height: 300,
    width: 300,
    // borderWidth: 3,
    // borderRadius: 20,
    // borderColor: 'white',
  },
});
