import React from "react";
import {useState} from "react";
import {View, Text, TextInput, Button, TouchableOpacity, StyleSheet} from "react-native";
import {useAppDispatch} from "../hooks";
import {addHabit} from "../store/addSlice";
import { Alert } from 'react-native';
import { loadHabitsFromStorage } from "../store/habitStorage";
import { useEffect } from "react";
import { saveHabitsToStorage } from "../store/habitStorage";

const iconoptions=['📖','💪','🎵','☕️','🎮','🛏️']


export default function AddHabit() {
    const [text,setText] = useState('');
    const[createTime,setCreateTime] = useState(new Date());
    const [icon, setIcon] = useState(iconoptions[0]);
    const dispatch=useAppDispatch();
    
    const handleSubmit = () => {
        
        if(text.trim()!==''){
            console.log('Dispatching new habit:', {text: text.trim(), icon,createTime:createTime.toISOString()});
            try {
                dispatch(addHabit({text:text.trim(),icon:icon.trim()}));
                dispatch(saveHabitsToStorage());
                console.log('Habit added successfully');
                Alert.alert('Success', 'Habit added successfully'); 
                setText('');
            } catch (error) {
                console.error('Error adding habit:', error);
                Alert.alert('Error', 'An error occurred while adding the habit');
            }
        } else {
            console.log('Empty habit text - not submitting');
        }
    }
    
    return (
        <View style={styles.container}>
            <Text style={{fontSize:35, fontWeight:"bold", marginTop:60}}>Add Habit</Text>
            <Text style={{fontSize:20, color:"grey", marginTop:40}}>Name</Text>

            <TextInput
            style={{backgroundColor: '#e0e0e0',borderRadius: 12, padding:20,marginTop:20}}
                placeholder="add you habit here"
                value={text}
                onChangeText={setText}
            />
            <Text style={{fontSize:20, color:"grey", marginVertical:20,marginTop:20}}>Icon</Text>
            <View style={styles.iconContainer}>
                {iconoptions.map((icn, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.iconButton,
                            icn === icon && styles.selectedIcon
                        ]}
                        onPress={() => setIcon(icn)}
                    >
                        <Text style={{fontSize: 24}}>{icn}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                activeOpacity={0.7}
            >
                <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      padding: 16,
    },
    
    button: {
      backgroundColor: '#007AFF',
      padding: 20,
      borderRadius: 20,
      alignItems: 'center',
      marginTop: 200,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
    iconContainer: {
      color: 'black',
      backgroundColor: '#e0e0e0',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      borderRadius: 12,
      padding:10,
    },
    iconButton: {
      padding: 10,
    },
    selectedIcon: {
      backgroundColor: '#aba6a6',
      borderRadius: 20,
    }
  });