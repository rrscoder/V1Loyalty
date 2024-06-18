// start writing your all api here....

import {useDispatch} from 'react-redux';
import {getData, postData} from './networkServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {updateCurrUser} from '../redux/slices/userSlice';
import axios from 'axios';
import {OneSignal} from 'react-native-onesignal';

export const getTodosfromAPI = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos');
  return res.json();
};


export const getValuesFromLocal = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error retrieving data for key "${key}":`, error);
    return null; // or any other default value you'd like to use
  }
};

export const getCurrentUserFromLocal = async () => {
  const data = await AsyncStorage.getItem('currentUser');
  return JSON.parse(data);
};

export const setItemToLocal = async (key, values) => {
  const jsonValue = JSON.stringify(values);
  await AsyncStorage.setItem(key, jsonValue);
};

export const getSettings = async () => {
  const data = await getData('/getsettings');
  return data;
};

export const login = async values => {
  const data = await postData('/userlogin', values);
  return data;
};

export const register = async values => {
  const data = await postData('/userregistration', values);
  return data;
};
export const deleteUser = async values => {
  const data = await postData('/deluser', values);
  return data;
};

export const getUserById = async values => {
  const subId = OneSignal.User.pushSubscription.getPushSubscriptionId();
  const data = await postData('/getuserbyid', {...values, token : subId});
  return data;
};

export const updateUserProfile = async values => {
  const data = await postData('/updateuser', values);
  return data;
};

export const isUserExist = async values => {
  const data = await postData('/check-email', values);
  console.log("data",data);
  if(data != undefined){
    return data;
  }
  
};



export const getAllStores = async () => {
  const data = await getData('/allstore');
  return data;
};

export const getAllFavStoresByUser = async values => {
  const data = await postData('/allfavStore', values);
  return data;
};

export const addToFavStore = async values => {
  const data = await postData('/addtofavStore', values);
  return data;
};

// Rewards

export const getAllRewards = async values => {
  const data = await postData('/allreward', values);

  return data;
};

// poined earned
export const addRewardToUser = async values => {
  const data = await postData('/addRewardToUser', values);
  return data;
};

export const getAllPointsEarned = async values => {
  const data = await postData('/getAllPointsEarned', values);
  return data;
};

// collect reward
export const collectReward = async values => {
  const data = await postData('/collectReward', values);
  return data;
};

export const allClaimedRewardByUser = async values => {
  const data = await postData('/allClaimedRewardByUser', values);
  return data;
};

// get all region
export const getAllRegion = async () => {
  const data = await getData('/allregion');
  return data;
};

// get all delivery options
export const getAllDeliveryOptions = async () => {
  const data = await getData('/get-delivery-options');
  return data;
};

// get all blogs
export const getAllBlogs = async () => {
  const data = await getData('/get-all-blogs');
  return data;
};