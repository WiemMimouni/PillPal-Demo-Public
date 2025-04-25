import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  containerStyle,
  textStyle,
  ...rest
}) => {
  return (
    <TouchableOpacity style={[styles.button, containerStyle]} {...rest}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#31E3B9",
    borderRadius: 8, // Responsive border radius (25/400 * 100)
    paddingVertical: hp("1%"), // Responsive vertical padding (15/800 * 100)
    alignItems: "center",
    justifyContent: "center",
    width: wp("80%"), // Default width to 80% of the screen width
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: wp("4%"), // Responsive font size (16/400 * 100)
    fontFamily: "PoppinsMedium",
  },
});

export default CustomButton;
