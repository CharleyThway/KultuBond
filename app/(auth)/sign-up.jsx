import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import FormField from "../../components/FormField";
import DropdownList from "../../components/DropDownList";
import icons from "../../constants/icons";
import { createUser } from "../../lib/appwrite";
import SecondaryButton from "../../components/SecondaryButton"; // Updated button
import TravelPreferences from "../../components/TravelPreferences"; // Ensure this is imported

const SignUp = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    name: "",
    confirmPassword: "",
    validWYDCode: "",
  });
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [selectedValue, setSelectedValue] = useState("ENFP");
  const [submitting, setSubmitting] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  
  const submit = async () => {
    // You can now access form data, selectedPreferences, and selectedValue here
    if (form.email === "" || form.password === "" || form.username === "" || form.name === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Proceed with sign-up logic here
    setSubmitting(true);
    try {
      const result = await createUser(
        form.username,
        form.email,
        form.password,
        form.name,
        form.validWYDCode, // Assuming this is used as `wyd_code`
        selectedValue, // This is for `mbti`
        selectedPreferences.join(','), // Convert array to string for travel preferences

      );
      setIsLogged(true);

      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const screenHeight = Dimensions.get("window").height;

  return (
    <SafeAreaView className="bg-[#12122C] h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-0"
          style={{
            minHeight: Dimensions.get("window").height - 100,
            paddingTop: screenHeight * 0.08,
          }}
        >
          <TouchableOpacity
            onPress={() => router.push("/")} // Navigating to the index.jsx page
            className="absolute top-0 left-4 pt-5"
          >
            <Image
              source={icons.backArrow} // Ensure this icon exists
              className="w-10 h-10"
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text className="text-5xl font-bold text-white mt-5 text-center">
            SIGN UP
          </Text>
          <View className="mt-10 bg-gray-200 p-6 rounded-2xl">
            <FormField
              title="Username"
              value={form.username}
              handleChangeText={(e) => setForm({ ...form, username: e })}
              otherStyles="mt-7 text-black"
              placeholder="Enter Username"
              keyboardType="default"
            />
            <FormField
              title="Name"
              value={form.name}
              handleChangeText={(e) => setForm({ ...form, name: e })}
              otherStyles="mt-7 text-black"
              placeholder="Enter Your Name"
            />
            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-7 text-black"
              placeholder="username@gmail.com"
            />
            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-7 text-black"
              placeholder="Enter Password"
            />
            <FormField
              title="Confirm Password"
              value={form.confirmPassword}
              handleChangeText={(e) => setForm({ ...form, confirmPassword: e })}
              otherStyles="mt-7 text-black"
              placeholder="Re-enter Password"
            />
            <FormField
              title="Valid WYD Code"
              value={form.validWYDCode}
              handleChangeText={(e) => setForm({ ...form, validWYDCode: e })}
              otherStyles="mt-7 text-black"
              placeholder="Enter valid code"
            />
            <View className="flex items-left mt-10">
              <DropdownList selectedValue={selectedValue} setSelectedValue={setSelectedValue} />
            </View>
            <View className="mt-8">
              <Text className="text-lg text-black text-center font-medium pb-10">Travel Preferences</Text>
              <View className="flex items-left">
                <TravelPreferences selectedPreferences={selectedPreferences} setSelectedPreferences={setSelectedPreferences} />
              </View>
            </View>
            <View className="flex items-left mt-10">
              <SecondaryButton
                title="Sign Up"
                handlePress={submit}
                isSubmitting={submitting} // Pass the submitting state to the button if needed
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
