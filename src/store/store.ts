import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FLUSH,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import rootReducer from './reducers/rootReducer';
import {configureStore} from '@reduxjs/toolkit';
import {thunk} from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, PERSIST, PURGE, REGISTER, REHYDRATE],
      },
    }).concat(thunk),
});

export const persister = persistStore(store);
