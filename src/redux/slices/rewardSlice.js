import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  rewards: {
    data: [],
    success: false,
    message: '',
  },
};

const rewardSlice = createSlice({
  name: 'rewards',
  initialState,
  reducers: {
    allRewards: (state, action) => {
      state.rewards = action.payload;
    },
  },
});

export const {allRewards} = rewardSlice.actions;
export default rewardSlice.reducer;
