import {Animated, View, Pressable, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Text, Button} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

const InfoModal = ({navigation, route}) => {
  const {colors} = useTheme();

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
          padding: 16,
          width: '85%',
          maxWidth: 400,
          height: 250,
          borderRadius: 30,
          backgroundColor: colors.card,
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <Pressable style={styles.closeModal} onPress={navigation.goBack}>
          <Ionicons name="close" size={30} color="gray" />
        </Pressable>

        <Text style={styles.text}>
          Passwords must be 8 characters long and must contain an uppercase
          letter, a lowercase letter, a number and a special character
          (#?!@$%^&*_)
        </Text>
      </Animated.View>
    </View>
  );
};

export default InfoModal;

const styles = StyleSheet.create({
  closeModal: {
    position: 'absolute',
    top: 20,
    right: 20,
  },

  text: {
    fontFamily: 'CircularStd-Bold',
    color: '#5387C6',
    textAlign: 'center',
    fontSize: 25,
    lineHeight:30
  },
});
