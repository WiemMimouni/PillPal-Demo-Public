import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  Switch,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useHeader } from "context/HeaderContext";
import { VStack, HStack } from "@gluestack-ui/themed";
import Feather from "react-native-vector-icons/Feather";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Settings = () => {
  const { screenName, setScreenName } = useHeader(); // Access screen name from the header context
  const [isSleepModeEnabled, setIsSleepModeEnabled] = React.useState(false);

  useEffect(() => {
    setScreenName("Settings");
  }, []);

  const handleToggleSwitch = () => {
    setIsSleepModeEnabled((previousState) => !previousState);
  };

  const handleEmailPress = () => {
    Linking.openURL("mailto:pillpallcontact@gmail.com");
  };

  return (
    <VStack style={styles.container}>
      <HStack style={styles.row}>
        <Feather name="bell" size={wp('6%')} color="#31E3B9" />
        <Text style={styles.label}>Notification</Text>
      </HStack>
      <VStack style={styles.card}>
        <HStack style={styles.cardRow}>
          <Text style={styles.cardLabel}>Work in sleep mode</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#FFFFFF" }}
            thumbColor={isSleepModeEnabled ? "#31E3B9" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={handleToggleSwitch}
            value={isSleepModeEnabled}
          />
        </HStack>
        <Text style={styles.cardDescription}>
          Check the battery saving settings and make sure that the application
          has the necessary permits and is entered in the exceptions.
        </Text>
      </VStack>
      <TouchableOpacity style={styles.button} onPress={handleEmailPress}>
        <HStack style={styles.buttonRow}>
          <Feather name="mail" size={wp('6%')} color="#31E3B9" />
          <Text style={styles.buttonText}>
            Write to pillpallcontact@gmail.com
          </Text>
          <Feather name="chevron-right" size={wp('6%')} color="#31E3B9" />
        </HStack>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <HStack style={styles.buttonRow}>
          <Feather name="star" size={wp('6%')} color="#31E3B9" />
          <Text style={styles.buttonText}>Rate the app</Text>
          <Feather name="chevron-right" size={wp('6%')} color="#31E3B9" />
        </HStack>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <HStack style={styles.buttonRow}>
          <Feather name="file-text" size={wp('6%')} color="#31E3B9" />
          <Text style={styles.buttonText}>Terms of Use</Text>
          <Feather name="chevron-right" size={wp('6%')} color="#31E3B9" />
        </HStack>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <HStack style={styles.buttonRow}>
          <Feather name="shield" size={wp('6%')} color="#31E3B9" />
          <Text style={styles.buttonText}>Privacy Policy</Text>
          <Feather name="chevron-right" size={wp('6%')} color="#31E3B9" />
        </HStack>
      </TouchableOpacity>
    </VStack>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: "#f5f5f5",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp('2%'),
    marginTop: hp('5%'),
  },
  label: {
    marginLeft: wp('2%'),
    fontSize: wp('4.5%'),
  },
  card: {
    backgroundColor: "rgba(49, 227, 185, 0.12)",
    padding: wp('4%'),
    borderRadius: 10,
    marginBottom: hp('2.5%'),
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLabel: {
    fontSize: wp('4%'),
    fontWeight: "bold",
    fontFamily: "PoppinsLight",
  },
  cardDescription: {
    fontSize: wp('3.5%'),
    color: "#666",
    marginTop: hp('1%'),
    fontFamily: "PoppinsLight",
  },
  button: {
    backgroundColor: "rgba(49, 227, 185, 0.12)",
    padding: wp('4%'),
    borderRadius: 10,
    marginBottom: hp('2.5%'),
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonText: {
    marginLeft: wp('2%'),
    fontSize: wp('4%'),
    fontFamily: "PoppinsLight",
    flex: 1, // Allow the text to take up the remaining space
  },
});
