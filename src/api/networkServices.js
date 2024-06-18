import axios from 'axios';
import {environment} from '../environments/environment';
import {Alert} from 'react-native';
// import Toast from 'react-native-toast-message';

const baseURL = environment.baseURL;

const axiosInstance = axios.create({
  baseURL,
  timeout: 5000, // Timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getData = async (endPoint, params = {}) => {
  try {
    const response = await axiosInstance.get(endPoint, {params});
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const postData = async (endPoint, data = {}) => {
  try {
    const response = await axiosInstance.post(endPoint, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const handleError = error => {
  // Handle error logic here
  // if (error?.code === 'ERR_NETWORK') {
  //   return Alert.alert(
  //     'Error!',
  //     `It seems like you are not connected with wifi or mobile data.`,
  //     [{text: 'OK'}],
  //   );
  // }

  return Alert.alert(
    'Error!',
    error?.response?.data && typeof error?.response?.data !== 'object'
      ? error?.response?.data
      : 'Something went wrong, please try again later',
    [{text: 'OK'}],
  );
};

export default axiosInstance;
