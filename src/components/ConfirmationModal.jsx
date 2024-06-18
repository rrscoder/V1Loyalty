
import {Animated, View, Pressable, Button, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Text} from 'react-native-paper';

const ConfirmationModal = ({navigation, route}) => {
  const {colors} = useTheme();
  const {title} = route.params;
  const extra = route?.params?.extra;

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
          paddingHorizontal: 16,
          paddingVertical:20,
          width: '65%',
          maxWidth: 400,
          // height: 230,
          borderRadius: 30,
          backgroundColor: colors.card,
          alignItems: 'center',
           justifyContent:'space-between',
          
        }}>
        <Pressable style={styles.closeModal} onPress={navigation.popToTop}>
          <Ionicons name="close" size={30} color='rgba(211, 211, 211, 0.9)' />
        </Pressable>

        <View style={styles.iconView}>
          <Ionicons name="checkmark" size={45} color="white" />
        </View>
        
        <Text style={[styles.text,{width: title?.length >= 50 ? '100%' : title?.length >= 40 ? '70%' : '70%',
          paddingTop: title?.length >= 50 ? 35 : title?.length >= 40 ? 20 : 20,
          paddingBottom: title?.length >= 50 ? 35 : title?.length >= 40 ? 20 : 20
        }]}>
          {/* {title?.length} */}
          {title}
        </Text>
        

        {extra ? (
          <View>
            <Text style={[styles.extraTitle,{marginTop:5}]}>
              {extra?.title}
            </Text>
            <Text style={styles.extraSubTitle}>
              {extra?.subTitle}
            </Text>
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
};

export default ConfirmationModal;
const styles = StyleSheet.create({
  iconView: {
    height: 60,
    width: 60,
    borderRadius: 100,
    backgroundColor: '#5387C6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'CircularStd-Bold',
    color: '#5387C6',
    textAlign: 'center',
    fontSize:20,
    lineHeight:20
  },
  extraTitle: {
    fontFamily: 'CircularStd-Bold',
    color: '#5387C6',
    textAlign: 'center',
    fontSize: 20,
    lineHeight:20,
  },
  extraSubTitle: {
    fontFamily: 'CircularStd-Book',
    color: '#5387C6',
    textAlign: 'center',
    fontSize: 12,
  },
  closeModal: {
    position: 'absolute',
    top: 10,
    right: 15,
  },
});

