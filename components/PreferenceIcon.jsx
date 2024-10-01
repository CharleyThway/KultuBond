import React from 'react';
import { View, Text } from 'react-native';

const PreferenceIcon = ({ name, Icon }) => {
  return (
    <View className="flex flex-col items-center">
      <View className="flex justify-center items-center overflow-hidden bg-white border border-solid border-zinc-300 h-[51px] w-[51px] rounded-full">
        {/* Ensure Icon is treated as a component */}
        {Icon && <Icon width={27} height={27} />} 
      </View>
      <View className="mt-2 text-base text-center text-black whitespace-nowrap">
        <Text className="text-xs">{name}</Text>
      </View>
    </View>
  );
};

export default PreferenceIcon;
