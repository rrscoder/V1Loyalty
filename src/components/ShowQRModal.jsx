import {Animated, View, Pressable, StyleSheet, Linking} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Text} from 'react-native-paper';
import {Image} from 'react-native';
import {imgSrc} from '../assets/imgSrc';

const ShowQRModal = ({navigation}) => {
  const {colors} = useTheme();

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    day: 'numeric', // Use 2-digit padding for day (optional)
    month: 'long',
    year: 'numeric',
  });

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
          {backgroundColor: 'rgba(0, 0, 0, 0.5)'},
        ]}
      />
      <Animated.View
        style={{
          width: '80%',
          maxWidth: 400,
          height: 350,
          borderRadius: 30,
          backgroundColor: colors.card,
          //   alignItems: 'center',
        }}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Pressable
            style={styles.closeModal}
            onPress={() => {
              navigation.navigate('Main');
            }}>
            <Ionicons name="close" size={30} color="gray" />
          </Pressable>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              marginTop: 20,
            }}>
            <View style={styles.titleView}>
              <Image
                source={imgSrc.qrCode}
                style={{
                  width: 150,
                  height: 150,
                }}
              />
              <Text variant="titleLarge" style={styles.subTitle}>
                Please show this QR Code to our staff for your Free Drink.
              </Text>
            </View>
            <View style={styles.btnGrp}>
              <Text>{`Redeemed on ${formattedDate}`}</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default ShowQRModal;

const styles = StyleSheet.create({
  titleView: {
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    // textAlign: 'center',
    fontFamily: 'CircularStd-Bold',
    color: '#5387C6',
    fontSize: 22,
  },
  subTitle: {
    textAlign: 'center',
    fontFamily: 'CircularStd-Medium',
    color: '#5387C6',
    fontSize: 20,
    marginTop: 20,
  },
  closeModal: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  btnGrp: {
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
