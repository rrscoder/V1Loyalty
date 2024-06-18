import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  region: {
    data: [],
    success: false,
    message: '',
  },
};

const regionSlice = createSlice({
  name: 'region',
  initialState,
  reducers: {
    allRegion: (state, action) => {
      state.region = action.payload;
    },
  },
});

export const {allRegion} = regionSlice.actions
export default regionSlice.reducer