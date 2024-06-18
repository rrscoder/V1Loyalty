import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  stores: {
    data: [],
    success: false,
    message: '',
  },
};

const storeSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    allStores: (state, action) => {
      state.stores = action.payload;
    },
  },
});

export const {allStores} = storeSlice.actions
export default storeSlice.reducer