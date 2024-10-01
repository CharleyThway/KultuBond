import React from 'react';
import { View, Text } from 'react-native';
import PreferenceIcon from './PreferenceIcon';
import icons from "../constants/icons";

const preferences = [
  {
    id: 1,
    name: 'Cultural',
    Icon: icons.culture,
  },
  {
    id: 2,
    name: 'Modern',
    Icon: icons.modern,
  },
  {
    id: 3,
    name: 'Nature',
    Icon: icons.nature,
  },
  {
    id: 4,
    name: 'Relax',
    Icon: icons.relax,
  },
  {
    id: 5,
    name: 'Food',
    Icon: icons.food,
  },
  {
    id: 6,
    name: 'Religion',
    Icon: icons.religion,
  },
  {
    id: 7,
    name: 'Historical',
    Icon: icons.history,
  },
  {
    id: 8,
    name: 'Museum',
    Icon: icons.museum,
  },
  {
    id: 9,
    name: 'Walking',
    Icon: icons.walk,
  },
];

const TravelPreferences = () => {
  const handlePreferenceSubmit = (preference) => {
    // TODO: Implement database submission logic here
    console.log(`Submitting preference: ${preference}`);
  };

  return (
    <View className="flex flex-col items-center max-w-[298px]">
      <View className="flex-row flex-wrap items-center gap-8 mx-auto max-w-full">
        {preferences.map((pref) => (
        <View key={pref.id} className="w-[20%]">
          <PreferenceIcon
            key={pref.id}
            name={pref.name}
            Icon={pref.Icon}
            onPress={() => handlePreferenceSubmit(pref.name)}
          />
        </View>
        ))}
      </View>
    </View>
  );
};

export default TravelPreferences;