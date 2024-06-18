// This is an demo slice for redux-toolkit,
// Create or modify this slice for our own...

import {createSlice, nanoid} from '@reduxjs/toolkit';

const initialState = {
  carts: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const allReadyExistOrNot = state.carts.find(
        f => f.id === action.payload.id,
      );

      if (!allReadyExistOrNot) {
        const cart = {
          id: nanoid(),
          ...action.payload,
        };
        state.carts.push(cart);
      }
    },
    removeToCart: (state, action) => {
      state.carts = state.carts.filter(f => f.id !== action.payload);
    },
  },
});

export const {addToCart, removeToCart} = cartSlice.actions;
export default cartSlice.reducer;
