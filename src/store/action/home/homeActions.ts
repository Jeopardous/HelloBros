import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPostData = createAsyncThunk(
  'post/fetchPostData',
  async () => {
    const response = await axios.get(
      'https://jsonplaceholder.typicode.com/posts',
    );
    return response.data;
  },
);
