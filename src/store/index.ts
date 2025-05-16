import {configureStore} from '@reduxjs/toolkit'
import addReducer from './addSlice'
import { Habit } from './type'
export const store = configureStore({
    reducer:{
        habits:addReducer,
    }
})



export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = (
    dispatch: AppDispatch,
    getState: () => RootState,) => ReturnType;
    
