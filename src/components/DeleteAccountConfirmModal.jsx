
import { Animated, View, Pressable, StyleSheet } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, Button, TextInput } from 'react-native-paper';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateCurrUser } from '../redux/slices/userSlice';
import { showToast } from '../utils/Utils';

const DeleteAccountConfirmModal = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [showPW, setShowPW] = useState(false);
  const { colors } = useTheme();

  const user = useSelector(state => state.currentUser.user);

  const dispatch = useDispatch();

  const signout = async () => {
    await AsyncStorage.removeItem('currentUser');
    await AsyncStorage.removeItem('registerFreeCoffeeAlert');
    await AsyncStorage.removeItem('birthDayFreeCoffeeAlert');

    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginOrRegistration' }],
    });
    dispatch(updateCurrUser({}));
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
        onPress={navigation.goBack}
      />
      <Animated.View
        style={{
          width: '85%',
          maxWidth: 400,
          borderRadius: 30,
          backgroundColor: colors.card,
        }}>
        <View>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              DELETE ACCOUNT
            </Text>
          </View>

          <View style={styles.body}>
            <View style={{height:25}}>
              <Text style={styles.bodyText}>
                Are you sure you wish to
              </Text>
            </View>
            <View style={{marginTop:-2,height:25}}>
              <Text style={styles.bodyText}>
                close your account?
              </Text>
            </View>
            <View style={{marginTop:-10,width:'100%',justifyContent:'center',alignItems:'center'}}>
            <Text style={styles.bodyDescription}>
              Closing your account will permanently delete all of your account
              information. Please note that this action will also result in the
              loss of all your accumulated rewards points.
            </Text>
            </View>
            <View style={{ width: '90%' }}>
              <Text style={styles.inpLabel}>Enter Password</Text>
              <TextInput
                id="country"
                style={styles.inp}
                placeholder="•••••"
                secureTextEntry={showPW ? false : true}
                underlineStyle={{
                  display: 'none',
                }}
                outlineStyle={{
                  borderRadius: 20,
                }}
                onChangeText={text => setPassword(text)}
                value={password}
                right={
                  <TextInput.Icon
                    icon={showPW ? 'eye' : 'eye-off'}
                    onPress={() => {
                      setShowPW(!showPW);
                    }}
                  />
                }
              />
            </View>
            <Button
              mode="contained"
              style={styles.bodyBtn}
              buttonColor="#5387C6"
              onPress={async () => {
                const response = await deleteUser({
                  id: user._id,
                  password: password,
                });

                if (response?.success) {
                  signout();
                } else{
                  navigation.navigate('ErrorModal', {
                    title: `Invalid Password`,
                    extra: {
                      title: '',
                      subTitle: 'Please Enter Correct password'
                    },
                  });
                }
              }}>
              DELETE ACCOUNT
            </Button>
          </View>

          <Pressable style={styles.closeModal} onPress={navigation.goBack}>
            <Ionicons name="close" size={30} color="gray" />
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
};

export default DeleteAccountConfirmModal;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#F6A917',
    borderRadius: 30,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'CircularStd-Bold',
    color: 'white',
    fontSize: 22,
  },
  body: {
    alignItems: 'center',
    padding: 10,
  },
  bodyText: {
    fontFamily: 'CircularStd-Bold',
    color: '#5387C6',
    textAlign: 'center',
    width: '90%',
    lineHeight: 18,
    fontSize: 20
  },
  bodyDescription: {
    fontFamily: 'CircularStd-Book',
    color: '#5387C6',
    textAlign: 'center',
    width: '90%',
    marginTop: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  bodyBtnGrp: {
    marginTop: 10,
  },
  bodyBtn: {
    width: '90%',
    marginTop: 10,
    marginBottom: 10,
    height: 50,
    justifyContent: 'center',
    borderRadius: 10,
  },
  inp: {
    borderRadius: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    width: '100%',
    // marginTop:10
  },
  inpLabel: {
    color: '#5387C6',
    marginBottom: 5,
    marginTop: 5,
  },
  closeModal: {
    position: 'absolute',
    top: 13,
    right: 20,
  },
});
