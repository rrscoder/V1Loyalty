import { Animated, View, Pressable, StyleSheet, Linking, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, Button } from 'react-native-paper';
import { Image } from 'react-native';
import { environment } from '../environments/environment';
import { useSelector } from 'react-redux';
import { collectReward } from '../api/api';
import { imgSrc } from '../assets/imgSrc';

const RedeemConfirmModal = ({ navigation, route }) => {
  const { colors } = useTheme();

  const user = useSelector(state => state.currentUser.user);
  const reward = route.params;

  const redeemReward = async () => {
    const data = await collectReward({
      user_id: user._id,
      reward_id: reward._id,
      product_id: reward.product_id,
    });

    navigation.navigate('ConfirmationModal', {
      title: 'You’re points have been successfully redeemed.',
      extra: {
        title: 'Your reward is on it’s way!',
        subTitle: 'Check your email for order details.',
      },
    });
  };
  const handleRedeemPress = () => {
    navigation.replace('Checkout', reward);
  };

  const isRedeemDisabled = user?.current_point < reward.reward_points || reward?.claimed;
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
          // height: 400,
          borderRadius: 30,
          backgroundColor: colors.card,
        }}>
        <View style={{ alignItems: 'center' }}>
          <Pressable style={styles.closeModal} onPress={navigation.goBack}>
            <Ionicons name="close" size={30} color="gray" />
          </Pressable>

          <View style={styles.left}>
            <Image
              source={
                reward?.product?.product_image
                  ? {
                    uri: `${environment.url}/uploads/mproduct/${reward?.product?.product_image}`,
                  }
                  : imgSrc.no_image
              }
              resizeMode='cover'
              style={{
                height: Platform.OS === 'android' ? 135 : 135,
                width: '100%',
                borderRadius:20
              }}
            />
          </View>

          <Text
            variant="headlineSmall"
            style={styles.title}>{`${reward?.product?.product_name}`}</Text>
          <Text>
            {reward?.reward_points
              ? `${reward?.reward_points} PTS`
              : `${reward?.product?.product_point} PTS`}
          </Text>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              // height: '100%',
              marginTop: 10,
            }}>
            <View style={styles.titleView}>
              {reward?.claimed ? (
                <Text variant="headlineSmall"  style={[styles.title,{fontSize:15,lineHeight:20}]}>
                  {`You already claimed this reward. You can still purchase this product`}
                </Text>
              ) : (
                <Text variant="headlineSmall" style={[styles.title,{fontSize:15,lineHeight:20}]}>
                  {user?.current_point >= reward.reward_points
                    ? 'Are you sure you want to redeem your points?'
                    : `Sorry you don't have enough points.
You can still purchase this product`}
                </Text>
              )}
            </View>
            <View style={styles.btnGrp}>
              {/* <Button
                mode="contained"
                style={styles.btn}
                buttonColor="#5387C6"
                onPress={() => {
                  // Linking.openURL(
                  //   'https://bobandberts.co.uk/product-category/gift-shop/', 
                  // );
                  // Linking.openURL(reward?.product?.buy_link);
                  const defaultLink = 'https://bobandberts.co.uk/product-category/gift-shop/';
                  const buyLink = reward?.product?.buy_link || defaultLink;
                  Linking.openURL(buyLink);
                  
                }}>
                BUY
              </Button> */}
              {/* <Button
                mode="contained"
                style={styles.btn}
                disabled={
                  user?.current_point >= reward.reward_points &&
                  !reward?.claimed
                    ? false
                    : true
                }
                buttonColor="#5387C6"
                onPress={() => {
                  navigation.replace('Checkout', reward);
                }}>
                REDEEM
              </Button> */}
              <TouchableOpacity style={styles.btn} onPress={() => {
                // Linking.openURL(
                //   'https://bobandberts.co.uk/product-category/gift-shop/', 
                // );
                // Linking.openURL(reward?.product?.buy_link);
                const defaultLink = 'https://bobandberts.co.uk/product-category/gift-shop/';
                const buyLink = reward?.product?.buy_link || defaultLink;
                Linking.openURL(buyLink);

              }}>
                <Text style={styles.btnText}>BUY</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, isRedeemDisabled && styles.disabledBtn]}
                disabled={isRedeemDisabled}
                onPress={handleRedeemPress}
              >
                <Text style={[styles.btnText, isRedeemDisabled && styles.disabledBtnText]}>REDEEM</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default RedeemConfirmModal;

const styles = StyleSheet.create({
  titleView: {
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontFamily: 'CircularStd-Bold',
    color: '#5387C6',
    fontSize: 23,
  },
  closeModal: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  btnGrp: {
    display: 'flex',
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  btn: {
    width: '45%',
    borderRadius: 10,
    backgroundColor: '#5387C6',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  left: {
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e6e6e6',
    // paddingVertical: 20,
    borderRadius: 20,
    marginTop: 30,
    marginBottom: 10,
  },
  disabledBtn: {
    backgroundColor: '#A9A9A9',
  },
  disabledBtnText: {
    color: '#D3D3D3',
  },
  btnText: {
    fontSize: 15,
    color: 'white',
    fontWeight:'bold'
  },
});
