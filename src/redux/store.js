import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './slices/cartSlice';
import userSlice from './slices/userSlice';
import storeSlice from './slices/storeSlice';
import favStoreSlice from './slices/favStoreSlice';
import rewardSlice from './slices/rewardSlice';
import settingSlice from './slices/settingSlice';
import regionSlice from './slices/regionSlice';
import deliveryOptionSlice from './slices/deliveryOptionSlice';
import newsSlice from './slices/newsSlice';
import currLocationSlice from './slices/currLocationSlice';

export const store = configureStore({
  reducer: {
    carts: cartSlice,
    currentUser: userSlice,
    stores: storeSlice,
    favStores: favStoreSlice,
    rewards: rewardSlice,
    settings: settingSlice,
    region: regionSlice,
    delOpts: deliveryOptionSlice,
    currLocation: currLocationSlice,
    blogs: newsSlice,
    // image: imageReducer,
    // add multiple reducers here...
  },
});
