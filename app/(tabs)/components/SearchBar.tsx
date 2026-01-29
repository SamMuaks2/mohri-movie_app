import { icons } from '@/constants/icons';
import React from 'react';
import { Image, Pressable, TextInput, View } from 'react-native';

interface Props {
    placeholder: string
    onPress?: () => void;
    value: string;
    onChangeText: (text: string) => void;
}

const SearchBar = ({placeholder, onPress, value, onChangeText}: Props) => {
  const isNavigationMode = !!onPress && !onChangeText;

  return (
    <Pressable onPress={isNavigationMode ? onPress : undefined}>
    <View className='flex-row items-center bg-dark-200 rounded-full px-5 py-4'>
      <Image source={icons.search} className='size-5' resizeMode='contain' tintColor='#AB8BFF' />
      <TextInput 
        onPress={onPress}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        editable={!isNavigationMode}
        pointerEvents={isNavigationMode ? 'none' : 'auto'}
        placeholderTextColor='#AB8BFF'
        className='flex-1 ml-2 text-white'
      />
    </View>
    </Pressable>
  )
}

export default SearchBar