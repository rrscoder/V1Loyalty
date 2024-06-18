
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  blogs: [],
  success: false,
  message: '',
};

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs: (state, action) => {
      state.blogs = action.payload.blogs;
      state.success = action.payload.success;
      state.message = action.payload.message;
    },
  },
});

export const { setBlogs } = blogSlice.actions;
export default blogSlice.reducer;
