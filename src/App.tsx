import { enableScreens } from 'react-native-screens';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import AddHabit from './components/AddHabit';
import HabitList from './components/HabitList';

// Initialize react-native-screens
enableScreens(true);

// 创建底部导航
const Tab = createBottomTabNavigator();

// 主应用组件
export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="HabitList"
          screenOptions={{
            headerShown: false,       // 不显示顶部导航栏
            tabBarShowLabel: false,   // 不显示底部导航标签
            tabBarStyle: {
              height: 100,
              paddingBottom: 20,
              paddingTop: 10,
            },
          }}
        >
          <Tab.Screen
            name="AddHabit"
            component={AddHabit}
            options={{
              tabBarIcon: ({ focused }) => (
                <Text style={{ marginTop:0, fontSize: 30, color: focused ? '#08b76f' : '#999' }}>➕</Text>
              ),
            }}
          />

          <Tab.Screen
            name="HabitList"
            component={HabitList}
            options={{
              tabBarIcon: ({ focused }) => (
                <Text style={{ fontSize: 25, color: focused ? '#010101' : '#999' }}>✅</Text>
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
