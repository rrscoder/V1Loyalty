import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  delOpts: {
    data: [],
    success: false,
    message: '',
  },
};

const deliveryOptionSlice = createSlice({
  name: 'delOpts',
  initialState,
  reducers: {
    allDelOpts: (state, action) => {
      state.delOpts = action.payload;
    },
  },
});

export const {allDelOpts} = deliveryOptionSlice.actions
export default deliveryOptionSlice.reducer