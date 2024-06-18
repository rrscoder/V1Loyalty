import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

export const checkBiometrics = async () => {
  try {
    const {biometryType} = await rnBiometrics.isSensorAvailable();
    return biometryType;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const generateBiometricPublicKey = async () => {
  try {
    const {keysExist} = await rnBiometrics.biometricKeysExist();

    if (keysExist) {
      // throw new Error('Biometric key exist.');
      return 'Biometric key exist.';
    }

    const {publicKey} = await rnBiometrics.createKeys();


    return publicKey;
  } catch (error) {
    console.log(error);
  }
};

export const deleteBiometricPublicKey = async () => {
  try {
    const {keysDeleted} = await rnBiometrics.deleteKeys();

    if (!keysDeleted) {
      // throw new Error('Cannot remove biomerics');
      return 'Cannot remove biomerics';
    }
    // console.log(publicKey, 'remove from the server');
  } catch (error) {
    console.log(error);
  }
};

export const loginWithBiometric = async userID => {
  try {
    const isBiometricsAvailable = await checkBiometrics();
    console.log("isBiometricsAvailable",isBiometricsAvailable);
    if (!isBiometricsAvailable) {
      // throw new Error('Biometric is not available');
      return 'Biometric is not available';
    }

    const {keysExist} = await rnBiometrics.biometricKeysExist();
    console.log("keysExist",keysExist);

    if (!keysExist) {
      const {publicKey} = await rnBiometrics.createKeys();
    }

    const {signature, success} = await rnBiometrics.createSignature({
      promptMessage: 'Please confirm your identity',
      payload: userID,
    });
    console.log("success",success);
    if (!success) {
      // throw new Error('Biometric Authentication failed');
      return 'Biometric Authentication failed';
    }
    console.log("signature",signature);

    return signature ? true : false;
  } catch (error) {
    console.log(error, 'err from loginWithBiometric');
    return false;
  }
};