import  {AppThunk}  from './index';
import { toogleHabit, movetobottom, movetotop } from './addSlice';

export const toggleWithDelay = (id: number): AppThunk => (dispatch, getState) => {
  const task = getState().habits.find(t => t.id === id);
  if (!task) return;

  dispatch(toogleHabit(id));

  setTimeout(() => {
    const updated = getState().habits.find(t => t.id === id);
    if (!updated) return;

    if (updated.completed) {
      dispatch(movetobottom(id));
    } else {
      dispatch(movetotop(id));
    }
  }, 1000);
};
