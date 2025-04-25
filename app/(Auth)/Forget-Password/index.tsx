import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton"; 
import { wp, hp } from "@/constants/ScreenSize";
import { Link } from "expo-router";

const ForgetScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <CustomInput
        keyboardType="email-address"
        label="Enter your email"
        containerStyle={styles.inputContainer}
        inputStyle={styles.input}
      />
      <CustomButton
        title="Send Reset Link"
        onPress={() => {
        }}
        containerStyle={styles.buttonContainer}
        textStyle={styles.buttonText}
      />
      <Link href={"/"} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </Link>
    </View>
  );
};

export default ForgetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#E9F5FE",
    padding: wp("5%"),
  },
  title: {
    fontSize: wp("6%"),
    marginBottom: hp("3%"),
    fontFamily: "PoppinsSemiBold",
    color: "#31E3B9",
  },
  inputContainer: {
    width: "100%",
    marginVertical: hp("1%"),
  },
  input: {
    height: hp("6%"),
    fontSize: wp("4%"),
  },
  buttonContainer: {
    width: wp("80%"),
    marginVertical: hp("3%"),
  },
  buttonText: {
    fontSize: wp("4%"),
  },
  backButton: {
    marginTop: hp("2%"),
    alignItems: "center",
  },
  backButtonText: {
    textDecorationLine: "underline",
    color: "grey",
  },
});
