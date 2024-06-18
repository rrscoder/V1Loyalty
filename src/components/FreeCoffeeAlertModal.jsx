
import {
  Animated,
  View,
  Pressable,
  StyleSheet,
  Linking,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text } from 'react-native-paper';
import { setItemToLocal, updateUserProfile } from '../api/api';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrUser } from '../redux/slices/userSlice';
import { Image } from 'react-native';
import { imgSrc } from '../assets/imgSrc';
import { Camera } from 'react-native-vision-camera';

const FreeCoffeeAlertModal = ({ navigation, route }) => {
  const { colors } = useTheme();

  const user = useSelector(state => state.currentUser.user);
  const { keyName, title, subTitle } = route.params.data;

  const requestCameraPermission = async () => {
    const cameraPermission = await Camera.requestCameraPermission();
    if (cameraPermission === 'granted') {
      if (user.status === '1') {
        navigation.replace('Scan', keyName);
      } else {
        navigation.navigate('ErrorModal', {
          title: `Verify Your Email !`,
          extra: {
            title: '',
            subTitle: 'Please verify your email to access your rewards and offers.',
          },
        });
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        
      }}>
      <Pressable
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
        ]}
        onPress={async () => {
          console.log('registerFreeCoffeeAlert');
          await setItemToLocal('registerFreeCoffeeAlert', false);
          navigation.goBack();
        }}
      />
      <Animated.View
        style={{
          width: '80%',
          // height:'40%',
          maxWidth: 400,
          //   height: 450,
          borderRadius: 30,
          backgroundColor: colors.card,
          alignItems: 'center',
          // paddingBottom:25
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            // height:400
          }}>
          <Pressable
            style={styles.closeModal}

            onPress={async () => {
              console.log('registerFreeCoffeeAlert 1');
              await setItemToLocal('registerFreeCoffeeAlert', false);
              navigation.goBack();
            }}>
            <Ionicons name="close" size={30} color="rgba(211, 211, 211,0.8)" />
          </Pressable>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 7,
              width: '85%'
              // backgroundColor:'green',
            }}>
            <Text
              style={{
                fontSize: 35,
                fontFamily: 'CircularStd-Medium',
                color: '#5387C6',
                textAlign: 'center',
                lineHeight: 35,
                marginTop: 10,
                
              }}>
              {title}
            </Text>
            <Image
              source={imgSrc.glass_free}
              style={{ width: 100, height: 100, marginVertical: 5 }}
              resizeMode="contain"
            />
            <Text
              style={{
                fontSize: 28,
                fontFamily: 'CircularStd-Medium',
                color: '#5387C6',
                textAlign: 'center',
                lineHeight: 28
              }}>
              {subTitle}
            </Text>
            <Pressable
              onPress={requestCameraPermission}
              style={
                Platform.OS === 'ios'
                  ? {
                    height: 40,
                    borderRadius: 6,
                    backgroundColor: '#F6A917',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                    marginVertical: 10,
                  }
                  : {
                    height: 40,
                    borderRadius: 6,
                    backgroundColor: '#F6A917',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                    marginVertical: 10,
                  }
              }>
              <Text
                style={
                  Platform.OS === 'ios'
                    ? {
                      fontSize: 13,
                      color: 'white',
                      fontFamily: 'CircularStd-Bold',
                    }
                    : {
                      fontSize: 14,
                      color: 'white',
                      fontFamily: 'CircularStd-Bold',
                    }
                }>
                Tap here to scan your code
              </Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default FreeCoffeeAlertModal;

const styles = StyleSheet.create({
  titleView: {
    width: '95%',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    // textAlign: 'center',
    fontFamily: 'CircularStd-Bold',
    color: '#5387C6',
    fontSize: 22,
  },
  subTitle: {
    // textAlign: 'center',
    fontFamily: 'CircularStd-Medium',
    color: '#5387C6',
    fontSize: 20,
    marginTop: 20,
  },
  closeModal: {
    position: 'absolute',
    top: 8,
    right: -18,
    zIndex: 20
  },
  btnGrp: {
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  btnClose: {
    backgroundColor: '#5387C6',
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
  },
  btn: {
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
    backgroundColor: '#5387C6',
  },
  left: {
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e6e6e6',
    paddingVertical: 20,
    borderRadius: 20,
    marginTop: 30,
    marginBottom: 10,
  },
});
