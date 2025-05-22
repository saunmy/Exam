// habitStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppThunk } from './index';
import { setHabits } from './addSlice';
import { RootState } from './index';

const STORAGE_KEY = 'HABITS';

export const saveHabitsToStorage = (): AppThunk => async (dispatch, getState) => {
  const habits = (getState() as RootState).habits.habits;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch (e) {
    console.error('Failed to save habits:', e);
  }
};

export const loadHabitsFromStorage = (): AppThunk => async (dispatch) => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      dispatch(setHabits(parsed));
    }
  } catch (e) {
    console.error('Failed to load habits:', e);
  }
};
