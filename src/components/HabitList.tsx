import React from 'react';
import { useCallback } from 'react';
import debounce from 'debounce';

import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAppSelector, useAppDispatch } from '../hooks';
import { toogleHabit, movetobottom, movetotop ,deleteHabit} from '../store/addSlice';
import { toggleWithDelay } from '../store/addThunks';


export default function HabitList() {
  const habits = useAppSelector(state => state.habits);
  const dispatch = useAppDispatch();
  
  const debouncedToggle = useCallback(
    debounce((id: number) => {
      dispatch(toggleWithDelay(id));
    }, 1000),
    [dispatch]
  );


  const renderItem = ({ item }: { item: { id: number; icon: string; text: string; completed: boolean } }) => (
    <TouchableOpacity   
      style={{ 
        flexDirection: 'row', 
        marginBottom: 8,
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        alignItems: 'center'
      }} 
      onPress={() => debouncedToggle(item.id)} // ✅ 直接调用 debounced 函数，不用 dispatch 外层了

    >
      <Text style={{ fontSize: 24, marginRight: 8 }}>{item.icon}</Text>
      <Text style={{ fontSize: 24, flex: 1 }}>{item.text}</Text>
      <Text style={{ fontSize: 24 }}>{item.completed ? '✓' : '○'}</Text>
      <TouchableOpacity onPress={() => {
        dispatch(deleteHabit(item.id));
      }}><Text style={{marginLeft:50}}>删除</Text></TouchableOpacity>
    </TouchableOpacity>
  );

  return (

    <SafeAreaView style={{ flex: 2, backgroundColor: '#fff' }}>
      <View style={{ padding: 16 }}>
        <Text style={{fontSize: 35, fontWeight: "bold", marginVertical: 20}}>Today's Habits</Text>
        <FlatList
          data={habits.habits}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
    </SafeAreaView>
  );
}
