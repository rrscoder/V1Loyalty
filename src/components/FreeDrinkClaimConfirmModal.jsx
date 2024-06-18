import {Animated, View, Pressable, StyleSheet, Linking} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Text} from 'react-native-paper';
import {setItemToLocal, updateUserProfile} from '../api/api';
import {useDispatch, useSelector} from 'react-redux';
import {updateCurrUser} from '../redux/slices/userSlice';

const FreeDrinkClaimConfirmModal = ({navigation, route}) => {
  const keyName = route.params;
  const {colors} = useTheme();

  const user = useSelector(state => state.currentUser.user);

  const dispatch = useDispatch();

  const handleClaimed = async key => {
    navigation.replace('ShowQRModal');

    if (key === 'stampsFreeCoffeeClaimable') {
      const userData = await updateUserProfile({
        stampsFreeCoffeeClaimable: false,
        _id: user['_id'],
        current_stamp: 0,
      });
      setItemToLocal('currentUser', userData?.data);
      dispatch(updateCurrUser(userData?.data));

    } else if (key === 'birthDayFreeCoffeeClaimed') {
      const userData = await updateUserProfile({
        birthDayFreeCoffeeClaimed: true,
        _id: user['_id'],
      });
      setItemToLocal('currentUser', userData?.data);
      setItemToLocal('birthDayFreeCoffeeAlert', false);
      dispatch(updateCurrUser(userData?.data));

    } else if (key === 'registerFreeCoffeeClaimed') {
      const userData = await updateUserProfile({
        registerFreeCoffeeClaimed: true,
        _id: user['_id'],
      });

      setItemToLocal('currentUser', userData?.data);
      setItemToLocal('registerFreeCoffeeAlert', false);
      dispatch(updateCurrUser(userData?.data));

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
          {backgroundColor: 'rgba(0, 0, 0, 0.5)'},
        ]}
        onPress={navigation.goBack}
      />
      <Animated.View
        style={{
          width: '80%',
          maxWidth: 400,
          height: 300,
          borderRadius: 30,
          backgroundColor: colors.card,
          //   alignItems: 'center',
        }}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Pressable style={styles.closeModal} onPress={navigation.goBack}>
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
              <Text variant="headlineSmall" style={styles.title}>
                The QR Code will only display once.
              </Text>
              <Text variant="titleLarge" style={styles.subTitle}>
                Please ensure you are at one of our stores and ready to order
                before proceeding further.
              </Text>
            </View>
            <View style={styles.btnGrp}>
              <Pressable
                mode="contained"
                style={styles.btnClose}
                buttonColor="#5387C6"
                onPress={navigation.goBack}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'CircularStd-Book',
                    color: 'white',
                  }}>
                  CLOSE
                </Text>
              </Pressable>
              <Pressable
                mode="contained"
                style={styles.btn}
                buttonColor="#5387C6"
                onPress={() => {
                  handleClaimed(keyName);
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'CircularStd-Book',
                    color: 'white',
                  }}>
                  I'm ready, display QR Code
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default FreeDrinkClaimConfirmModal;

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
    top: 20,
    right: 20,
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
