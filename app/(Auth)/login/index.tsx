import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import LoginForm from "@/components/LoginForm";
import SignUpForm from "@/components/Signup/SignupForm";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <ActionSheetProvider>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.leftButton,
              isLogin && styles.activeButton,
            ]}
            onPress={() => setIsLogin(true)}
          >
            <Text
              style={[styles.buttonText, isLogin && styles.activeButtonText]}
            >
              Log In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.rightButton,
              !isLogin && styles.activeButton,
            ]}
            onPress={() => setIsLogin(false)}
          >
            <Text
              style={[styles.buttonText, !isLogin && styles.activeButtonText]}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.formContainer}>
          {isLogin ? <LoginForm /> : <SignUpForm />}
        </ScrollView>
      </KeyboardAvoidingView>
    </ActionSheetProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9F5FE",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp("10%"), // Adjusted to avoid the notch
    marginBottom: hp("5%"),
  },
  button: {
    paddingVertical: hp("1.25%"),
    borderRadius: wp("5%"),
    borderWidth: 1,
    borderColor: "#1AC29A",
    width: wp("40%"), // Reduced width to fit the screen better with margin between
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  leftButton: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: wp("5%"),
    borderBottomRightRadius: wp("5%"),
    marginLeft: 0, // Remove left margin
  },
  rightButton: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: wp("5%"),
    borderBottomLeftRadius: wp("5%"),
    marginRight: 0, // Remove right margin
  },
  activeButton: {
    backgroundColor: "#31E3B9",
  },
  buttonText: {
    fontSize: wp("4%"),
    color: "#31E3B9",
    fontFamily: "PoppinsBold",
  },
  activeButtonText: {
    color: "#FFF",
  },
  formContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: wp("5%"),
  },
});

export default AuthScreen;
