import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';

interface Props {
  iconName: keyof typeof Ionicons.glyphMap
  style?: StyleProp<ViewStyle>
  onPress: () => void,
}

const FAB = ({ onPress, style, iconName }: Props) => {
  return (
    <View className='z-50 absolute h-30 w-30 rounded-full p-3 bg-blue-500 justify-center items-center elevation-md' style={ [style] }>
      <TouchableOpacity
        onPress={ onPress }
      >
        <Ionicons name={ iconName } color={'white'} size={35}/>
      </TouchableOpacity>
    </View>
  )
}

export default FAB
