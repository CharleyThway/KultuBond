import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
//import { useGlobalContext } from "../context/GlobalProvider"; // Assuming you have a global context setup

const Welcome = () => {
  // const { loading, isLogged } = useGlobalContext();

  // if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <SafeAreaView className="bg-primary h-full">
      {/* Background Image */}
      <Image
        source={images.mainBackground} // Update the image path based on your structure
        className="absolute w-full h-full"
        resizeMode="cover"
      />
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        {/* Overlay */}
        <View className="absolute w-full h-full bg-black/50" />

        {/* Main Content */}
        <View className="flex flex-col justify-center items-center h-full">
          {/* Title */}
          <Text className="text-5xl font-bold text-white mb-4 tracking-widest">
            KULTU BOND
          </Text>

          {/* Subtitle */}
          <Text className="text-center text-white text-base mb-10 px-6">
            Embark on an unforgettable journey through Korean culture along with
            fellow participants of World Youth Day 2027
          </Text>

          {/* Buttons */}
          <View className="flex-row space-x-4">
            {/* Join us button */}
            <PrimaryButton
              title="Join us"
              handlePress={() => router.push("/sign-up")}
            />

            {/* Sign-in button */}
            <SecondaryButton
              title="Sign in"
              handlePress={() => router.push("/sign-up")}
            />
          </View>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="transparent" style="light" />
    </SafeAreaView>
  );
};

export default Welcome;
