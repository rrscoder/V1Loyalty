import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  setting: {
    data: {},
    success: false,
    message: '',
  },
};

const settingSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    setSettings: (state, action) => {
      state.setting = action.payload;
    },
  },
});

export const {setSettings} = settingSlice.actions;
export default settingSlice.reducer;
