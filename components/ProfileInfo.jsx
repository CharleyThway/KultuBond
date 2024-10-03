import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import TravelPreferences from './TravelPreferences';
import PreferenceIcon from './PreferenceIcon'; // Assuming you have this for rendering icons
import icons from '../constants/icons'; // Assuming this has your icons
import SvgUri from 'react-native-svg-uri';

const ProfileInfo = ({ userProfile }) => {
  const [editMode, setEditMode] = useState(false);

  // Safely access travelPreferences, default to an empty string if it's undefined
  const travelPreferences = userProfile?.travel_preferences || "";

  useEffect(() => {
    console.log("Type of travel_preferences:", typeof travelPreferences); // Check if it's a string or not
    console.log("Value of travel_preferences:", travelPreferences); // Log the actual value
  }, [travelPreferences]);

  // Split the preferences string into an array
  const selectedPreferences = travelPreferences ? travelPreferences.split(",") : [];

  // Toggle edit mode
  const handleEditModeToggle = () => {
    setEditMode((prev) => !prev);
  };

  return (
    <>
      <View className="flex gap-3 self-start text-black">
        <View className="flex flex-col text-base whitespace-nowrap">
          <Image
            source={{ uri: userProfile?.avatar }}
            className="object-contain aspect-[1.07] w-[113px]"
          />
          <View className="self-center">
            <Text>{userProfile?.username}</Text>
          </View>
        </View>

        <View className="flex flex-col my-auto">
          <View className="self-center text-2xl font-bold">
            <Text>Introduction</Text>
          </View>
          <View className="mt-5 text-base">
            <Text>{userProfile?.introduction || "No introduction provided"}</Text>
          </View>
        </View>
      </View>

      {/* Travel Preferences */}
      <View className="mt-7">
        <View className="flex flex-row justify-between items-center">
          <Text className="text-lg">Travel Preferences</Text>
          {/* Edit button to toggle editMode */}
          <TouchableOpacity onPress={handleEditModeToggle}>
            <icons.edit width="20" height="20" />
          </TouchableOpacity>
        </View>

        {editMode ? (
          // Render the travel preference icons as selectable (edit mode)
          <TravelPreferences
            selectedPreferences={selectedPreferences}
            setSelectedPreferences={(updatedPreferences) =>
              setForm({
                ...form,
                travel_preferences: updatedPreferences.join(","),
              })
            }
          />
        ) : (
          // Display selected preferences as icons (read-only mode)
          <View className="flex flex-wrap mt-3">
            {selectedPreferences.length > 0 ? (
              selectedPreferences.map((pref, index) => {
                const icon = icons[pref.toLowerCase()];
                return (
                  <View key={index} className="flex items-center mr-4">
                    <PreferenceIcon name={pref} Icon={icon} />
                  </View>
                );
              })
            ) : (
              <Text>No travel preferences selected</Text>
            )}
          </View>
        )}
      </View>
    </>
  );
};

export default ProfileInfo;
