import { createSlice ,PayloadAction} from "@reduxjs/toolkit";
import { Habit } from "./type";
const initialState: Habit[] = [];
let nextTodoId = 0;
export const addSlice = createSlice({
    initialState,
    name:"habits",
    reducers:{
        addHabit:(state,action:PayloadAction<{text:string; icon:string; id?:number; completed?:boolean}>) => {
            state.unshift({
                id: action.payload.id ?? ++nextTodoId,
                text: action.payload.text,
                icon: action.payload.icon,
                completed: action.payload.completed ?? false,
                createTime: new Date().getTime(),
                completedTime: 0,
            });
        },
        toogleHabit:(state,action:PayloadAction<number>)=>{
            const habit = state.find((habit)=>habit.id === action.payload);
            if(habit){
                habit.completed = !habit.completed;
                habit.completedTime = habit.completed? new Date().getTime():0;
            }
            
        },
        movetobottom:(state,action:PayloadAction<number>)=>{
            const habit = state.find((habit)=>habit.id === action.payload);
            if(habit){
                const [item] = state.splice(state.indexOf(habit),1);
                state.push(item);
            }
            
        },
        movetotop:(state,action:PayloadAction<number>)=>{
            const habit = state.find((habit)=>habit.id === action.payload);
            if(habit){
                const [item] = state.splice(state.indexOf(habit),1);
                state.unshift(item);
            }
        },
        deleteHabit:(state,action:PayloadAction<number>)=>{
            const habit = state.find((habit)=>habit.id === action.payload);
            if(habit){
                state.splice(state.indexOf(habit),1);
            }
        }
    }
    
})
export const {addHabit,toogleHabit,movetobottom,movetotop,deleteHabit} = addSlice.actions;
export default addSlice.reducer;
