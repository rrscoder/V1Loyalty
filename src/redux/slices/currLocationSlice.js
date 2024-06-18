import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  currLocation: {
    data: [],
    success: false,
    message: '',
  },
};

const currLocationSlice = createSlice({
  name: 'currLocation',
  initialState,
  reducers: {
    setUserCurrLocation: (state, action) => {
      state.currLocation = action.payload;
    },
  },
});

export const {setUserCurrLocation} = currLocationSlice.actions
export default currLocationSlice.reducer