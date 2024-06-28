import {combineReducers} from 'redux';
import homeSlice from './home/homeSlice';

const rootReducer = combineReducers({
  postData: homeSlice.reducer,
});

export default rootReducer;
