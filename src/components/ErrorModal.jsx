import {Animated, View, Pressable, Button, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Text} from 'react-native-paper';

const ErrorModal = ({navigation, route}) => {
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
          padding: 16,
          width: '65%',
          // height: 230,
          maxWidth: 400,
          // height: 320,
          borderRadius: 30,
          backgroundColor: colors.card,
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'space-around',
        }}>
        <View>
          <Pressable style={styles.closeModal} onPress={navigation.goBack}>
            <Ionicons name="close" size={30} color="rgba(211, 211, 211, 0.9)" />
          </Pressable>

          <View style={styles.iconView}>
            <Ionicons name="close" size={45} color="white" />
          </View>
        </View>
        <Text variant="headlineLarge" style={styles.text}>
          {title}
        </Text>

        {extra ? (
          <View>
            {extra?.title && (
              <Text style={styles.extraTitle}>{extra?.title}</Text>
            )}

            <Text style={styles.extraSubTitle}>{extra?.subTitle}</Text>
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
};

export default ErrorModal;
const styles = StyleSheet.create({
  iconView: {
    height: 60,
    width: 60,
    borderRadius: 100,
    backgroundColor: '#f55b5b',
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: 10,
  },
  text: {
    fontFamily: 'CircularStd-Bold',
    color: '#5387C6',
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 20,
    paddingTop: 25,
    paddingBottom: 5,
  },
  extraTitle: {
    // fontFamily: 'CircularStd-Bold',
    color: '#5387C6',
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 20,
    marginTop: 10,
    marginBottom: 5,
  },
  extraSubTitle: {
    fontFamily: 'CircularStd-Book',
    color: '#5387C6',
    textAlign: 'center',
    fontSize: 12,
  },
  closeModal: {
    position: 'absolute',
    top: -10,
    right: -80,
  },
});
