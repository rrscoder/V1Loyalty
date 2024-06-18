import {Animated, View, Pressable, StyleSheet, TouchableOpacity} from 'react-native';
import {StackActions, useNavigation, useTheme} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Text, Button} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from '../navigation/RootNavigation';
import {useDispatch} from 'react-redux';
import {updateCurrUser} from '../redux/slices/userSlice';
const lightenHexColor = (hex, percent) => {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  r = Math.min(255, Math.floor(r + (255 - r) * percent));
  g = Math.min(255, Math.floor(g + (255 - g) * percent));
  b = Math.min(255, Math.floor(b + (255 - b) * percent));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};
const SignoutConfirmModal = () => {
  const originalColor = '#5387C6';
  const lightenedColor = lightenHexColor(originalColor, 0.8);
  const {colors} = useTheme();
  const dispatch = useDispatch();

  const navigation = useNavigation();
  
  
  const signout = async () => {
    
    await AsyncStorage.removeItem('currentUser')
    await AsyncStorage.removeItem('registerFreeCoffeeAlert')
    await AsyncStorage.removeItem('birthDayFreeCoffeeAlert')

      navigation.reset({
        index: 0,
        routes: [{name: 'LoginOrRegistration'}],
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
          {backgroundColor: 'rgba(0, 0, 0, 0.5)'},
        ]}
        onPress={navigation.goBack}
      />
      <Animated.View
        style={{
          //   padding: 16,
          width: '85%',
          maxWidth: 400,
          height: 320,
          borderRadius: 30,
          backgroundColor: colors.card,
        }}>
        <View>
          <View style={styles.header}>
            <Text variant="headlineMedium" style={styles.headerText}>
              SIGN OUT
            </Text>
          </View>

          <View style={styles.body}>
            <Text variant="headlineSmall" style={styles.bodyText}>
              Are you sure you want to sign out?
            </Text>
            <View style={styles.bodyBtnGrp}>
              {/* <Button
                mode="contained"
                style={styles.bodyBtn}
                buttonColor="#5387C6"
                onPress={() => {
                  signout();
                }}>
                SIGN OUT
              </Button> */}
              <TouchableOpacity onPress={()=>{ signout()}} style={{width:'90%',backgroundColor:'#5387C6',justifyContent:'center',alignItems:'center',height:45,alignSelf:'center',borderRadius:5}}>
                <Text style={{color:'#fff', fontFamily: 'CircularStd-Bold',fontSize:20}}>SIGN OUT</Text>
              </TouchableOpacity>
              {/* <Button
                mode="outlined"
                style={styles.bodyBtn}
                labelStyle={{color: '#5387C6'}}
                onPress={navigation.goBack}>
                CANCEL
              </Button> */}
               <TouchableOpacity  onPress={navigation.goBack} style={{width:'90%', backgroundColor: lightenedColor,justifyContent:'center',alignItems:'center',height:45,alignSelf:'center',borderRadius:5}}>
                <Text style={{color:'#fff', fontFamily: 'CircularStd-Bold',fontSize:20}}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Pressable style={styles.closeModal} onPress={navigation.goBack}>
            <Ionicons name="close" size={30} color="#fff" />
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
};

export default SignoutConfirmModal;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#F6A917',
    borderRadius: 30,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'CircularStd-Bold',
    color: 'white',
    fontSize:20
  },
  body: {
    alignItems: 'center',
    gap: 30,
    padding: 10,
  },
  bodyText: {
    fontFamily: 'CircularStd-Bold',
    color: '#5387C6',
    textAlign: 'center',
    width: '90%',
    lineHeight:22,
    fontSize:20,
    marginTop:15
  },
  bodyBtnGrp: {
    width: '70%',
    gap: 15,
  },
  bodyBtn: {
    // width: '100%',
  },
  closeModal: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
});
