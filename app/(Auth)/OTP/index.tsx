import { View, Text } from "react-native";
import React, { RefObject, useState } from "react";
import CustomInput from "components/CustomInput";
import CustomButton from "components/CustomButton";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "hooks/useAuth";
import { useRef } from "react";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Image } from "@gluestack-ui/themed";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const OTP = () => {
  const otpInput1 = useRef(null);
  const otpInput2 = useRef(null);
  const otpInput3 = useRef(null);
  const otpInput4 = useRef(null);
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);

  const handleTextChange = (
    text: string,
    nextRef: RefObject<TextInput> | null,
    prevRef: RefObject<TextInput> | null,
    index: number
  ) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text) {
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    } else {
      if (prevRef && prevRef.current) {
        prevRef.current.focus();
      }
    }
  };
  console.log(otp.join(""));

  const { verifyOtp, checkAuth } = useAuth();

  const [value, setValue] = useState<string>("");

  const { email } = useLocalSearchParams<any>();
  console.log(email);

  const handleotp = () => {
    verifyOtp(otp.join(""), email);
  };
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("assets/OTP 1.png")}
          alt="bg"
          style={styles.image}
        />
      </View>
      <Text style={styles.title}>OTP Verification</Text>
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>Enter the OTP sent to</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
      <View style={styles.otpContainer}>
        <TextInput
          ref={otpInput1}
          style={styles.otpInput}
          maxLength={1}
          keyboardType="number-pad"
          onChangeText={(text) => handleTextChange(text, otpInput2, null, 0)}
        />
        <TextInput
          ref={otpInput2}
          style={styles.otpInput}
          maxLength={1}
          keyboardType="number-pad"
          onChangeText={(text) =>
            handleTextChange(text, otpInput3, otpInput1, 1)
          }
        />
        <TextInput
          ref={otpInput3}
          style={styles.otpInput}
          maxLength={1}
          keyboardType="number-pad"
          onChangeText={(text) =>
            handleTextChange(text, otpInput4, otpInput2, 2)
          }
        />
        <TextInput
          ref={otpInput4}
          style={styles.otpInput}
          maxLength={1}
          keyboardType="number-pad"
          onChangeText={(text) => handleTextChange(text, null, otpInput3, 3)}
        />
      </View>
      <Text style={styles.resendText}>
        Didn’t you receive the OTP?{" "}
        <Text style={styles.resendLink}>Resend OTP</Text>
      </Text>
      <TouchableOpacity style={styles.verifyButton} onPress={() => handleotp()}>
        <Text style={styles.verifyButtonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OTP;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: wp("5%"),
    backgroundColor: "#F5F9FF",
  },
  imageContainer: {
    marginTop: hp("5%"),
    marginBottom: hp("5%"),
    alignItems: "center",
  },
  image: {
    width: wp("50%"),
    height: wp("50%"),
  },
  title: {
    fontSize: wp("6%"),
    fontFamily: "PoppinsBold",
    color: "#333",
    marginBottom: hp("2%"),
  },
  subtitleContainer: {
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  subtitle: {
    fontSize: wp("4%"),
    color: "#666",
    textAlign: "center",
    fontFamily: "PoppinsLight",
  },
  email: {
    fontSize: wp("4%"),
    fontFamily: "PoppinsBold",
    color: "#333",
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: wp("80%"),
    marginBottom: hp("3%"),
  },
  otpInput: {
    width: wp("12%"),
    height: wp("12%"),
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
    fontSize: wp("5%"),
    borderRadius: 8,
  },
  resendText: {
    color: "#666",
    marginBottom: hp("2%"),
    textAlign: "center",
  },
  resendLink: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  verifyButton: {
    backgroundColor: "#31E3B9",
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("20%"),
    borderRadius: 8,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: wp("4%"),
    fontWeight: "bold",
  },
});
