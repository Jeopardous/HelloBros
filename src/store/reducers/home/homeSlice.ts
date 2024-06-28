import {createSlice} from '@reduxjs/toolkit';
import {fetchPostData} from '../../action/home/homeActions';
import {RootState} from '../../types/types';

const initialState = {
  data: null,
  loading: 'idle',
  error: '',
};
const homeSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPostData.pending, state => {
        (state.loading = 'pending'), (state.error = '');
      })
      .addCase(fetchPostData.fulfilled, (state, action) => {
        (state.loading = 'success'),
          (state.error = ''),
          (state.data = action.payload);
      })
      .addCase(fetchPostData.rejected, (state, action) => {
        (state.loading = 'failed'),
          (state.error = action.error.message ?? 'An Error Occurred');
      });
  },
});

export const getPostData = (state: RootState) => state.postData;

export default homeSlice;
