import  {AppThunk}  from './index';
import { toogleHabit, movetobottom, movetotop } from './addSlice';
import { saveHabitsToStorage } from './habitStorage';

export const toggleWithDelay = (id: number): AppThunk => (dispatch, getState) => {
  const task = getState().habits.habits.find(t => t.id === id);
  if (!task) return;

  dispatch(toogleHabit(id));
  dispatch(saveHabitsToStorage());

  setTimeout(() => {
    const updated = getState().habits.habits.find(t => t.id === id);
    if (!updated) return;

    if (updated.completed) {
      dispatch(movetobottom(id));
    } else {
      dispatch(movetotop(id));
    }
    dispatch(saveHabitsToStorage());
  }, 1000);
};

  

