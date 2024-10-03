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
// import { getCurrentUser, signIn } from "../../lib/appwrite";
// import { useGlobalContext } from "../../context/GlobalProvider";
import SecondaryButton from "../../components/SecondaryButton"; // Updated button

const SignIn = () => {
  // const { setUser, setIsLogged } = useGlobalContext();
  // const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // const submit = async () => {
  //   if (form.email === "" || form.password === "") {
  //     Alert.alert("Error", "Please fill in all fields");
  //   }

  //   setSubmitting(true);

  //   try {
  //     await signIn(form.email, form.password);
  //     const result = await getCurrentUser();
  //     setUser(result);
  //     setIsLogged(true);

  //     Alert.alert("Success", "User signed in successfully");
  //     router.replace("/home");
  //   } catch (error) {
  //     Alert.alert("Error", error.message);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const screenHeight = Dimensions.get("window").height;

  return (
    <SafeAreaView className="bg-[#12122C] h-full">
      {/* Background color updated */}
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
            {/* Font size adjusted */}
            SIGN UP
          </Text>
          <View className="mt-10 bg-gray-200 p-6 rounded-2xl">
            <FormField
              title="Username"
              value={form.username}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-7 text-black"
              placeholder="Enter Username"
              keyboardType="default"
            />

            <FormField
              title="Name"
              value={form.name}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-7 text-black"
              placeholder="Enter Password"
            />

            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, password: e })}
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
              value={form.name}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-7 text-black"
              placeholder="Re-enter Password"
            />

            <FormField
              title="Valid WYD Code"
              value={form.name}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-7 text-black"
              placeholder="Enter valid code"
            />
            <View className="flex items-left mt-10">
              <DropdownList />
            </View>

            <View className="flex items-left mt-10">
              {/* Centered the button */}
              <SecondaryButton
                title="Sign Up"
                handlePress={() => router.push("/home")}
                containerStyles=""
                // isLoading={isSubmitting}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
