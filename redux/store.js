import { combineReducers, configureStore,applyMiddleware } from '@reduxjs/toolkit'
import  userReducer  from './user/userSlice.js'
import {persistReducer} from 'redux-persist'
import persistStore from 'redux-persist/es/persistStore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import logger from 'redux-logger';


const rootReducer =combineReducers({user: userReducer})

const persistConfig = {
    key : 'root',
    storage: AsyncStorage,
    version: 1
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: applyMiddleware(logger),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  
})

export const persistor = persistStore(store)