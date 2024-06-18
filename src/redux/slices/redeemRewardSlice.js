import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  redeemRewards: {
    data: [],
    success: false,
    message: '',
  },
};

const redeemRewards = createSlice({
  name: 'redeemRewards',
  initialState,
  reducers: {
    allRedeemRewards: (state, action) => {
      state.redeemRewards = action.payload;
    },
  },
});

export const {allRedeemRewards} = redeemRewards.actions;
export default redeemRewards.reducer;
