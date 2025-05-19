import { createSlice ,PayloadAction} from "@reduxjs/toolkit";
import { Habit } from "./type";

interface HabitState{
  habits:Habit[];
  nextId:number;
}
const initialState: HabitState = {
    habits:[],
    nextId:1,
}
//let nextTodoId = 0;
export const addSlice = createSlice({
    initialState,
    name:"habits",
    reducers: {
      addHabit: (
        state,
        action: PayloadAction<{ text: string; icon: string; id?: number; completed?: boolean }>) => {
        const id = action.payload.id ?? state.nextId++;
        state.habits.unshift({
          id,
          text: action.payload.text,
          icon: action.payload.icon,
          completed: action.payload.completed ?? false,
          createTime: new Date().getTime(),
          completedTime: 0,
        });
      },
        toogleHabit:(state,action:PayloadAction<number>)=>{
            const habit = state.habits.find((habit)=>habit.id === action.payload);
            if(habit){
                habit.completed = !habit.completed;
                habit.completedTime = habit.completed? new Date().getTime():0;
            }
            
        },
        movetobottom:(state,action:PayloadAction<number>)=>{
            const habit = state.habits.find((habit)=>habit.id === action.payload);
            if(habit){
                const [item] = state.habits.splice(state.habits.indexOf(habit),1);
                state.habits.push(item);
            }
            
        },
        movetotop:(state,action:PayloadAction<number>)=>{
            const habit = state.habits.find((habit)=>habit.id === action.payload);
            if(habit){
                const [item] = state.habits.splice(state.habits.indexOf(habit),1);
                state.habits.unshift(item);
            }
        },
        deleteHabit:(state,action:PayloadAction<number>)=>{
            const habit = state.habits.find((habit)=>habit.id === action.payload);
            if(habit){
                state.habits.splice(state.habits.indexOf(habit),1);
            }
        }
    }
    
})
export const {addHabit,toogleHabit,movetobottom,movetotop,deleteHabit} = addSlice.actions;
export default addSlice.reducer;
