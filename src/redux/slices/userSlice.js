import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  user: {
    data: {},
    success: false,
    message: '',
  },
};

const userSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    updateCurrUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const {updateCurrUser} = userSlice.actions
export default userSlice.reducer