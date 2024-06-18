import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAllFavStoresByUser} from '../../api/api';

export const fetchFavStore = createAsyncThunk('fetchFavStore', async userId => {
  const data = await getAllFavStoresByUser({user_id: userId});
  return data;
});

const initialState = {
  isLoading: false,
  isError: false,
  favStores: null,
};

const favStoreSlice = createSlice({
  name: 'favStores',
  initialState,
  reducers: {
    addToFav: (state, action) => {
      state.favStores?.stores?.push(action.payload);
    },
    removeFromFav: (state, action) => {
      console.log(action.payload,964)
      state.favStores.stores = state.favStores?.stores?.filter(f => f.id !== action.payload);
      // const newArray = state?.favStores?.stores?.filter(f => f._id !== action.payload);
      // console.log(state.favStores?.stores,273)
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchFavStore.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchFavStore.fulfilled, (state, action) => {
      state.isLoading = false;
      state.favStores = action.payload;
    });
    builder.addCase(fetchFavStore.rejected, (state, action) => {
      console.log('Error', action.payload, action.error);
      state.isLoading = false;
      state.isError = action.payload;
    });
  },
});

export const {addToFav, removeFromFav} = favStoreSlice.actions;
export default favStoreSlice.reducer;
