import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Checkbox } from "react-native-paper";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Box, Center } from "@gluestack-ui/themed";

interface MedicineBoxProps {
  title: string;
  subtitle1: string;
  subtitle2: string;
  initialChecked: boolean;
  isToday: boolean;
  onChange: () => void;
  onPress: () => void; // New onPress prop
}

const MedicineBox: React.FC<MedicineBoxProps> = ({
  title,
  subtitle1,
  subtitle2,
  initialChecked,
  onChange,
  onPress,
  isToday,
}) => {
  const [checked, setChecked] = useState(initialChecked);

  const handlePress = () => {
    const newCheckedState = !checked;
    setChecked(newCheckedState);
    onChange();
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView
        style={[
          styles.container,
          {
            borderLeftColor: !isToday
              ? "#778899"
              : checked
              ? "#31E3B9"
              : "#FFC700",
          },
        ]}
      >
        <Box
          style={[
            {
              borderColor: !isToday
                ? "#778899"
                : checked
                ? "#31E3B9"
                : "#FFC700",
            },
          ]}
          borderWidth={1}
          borderRadius={8}
        >
          <Center>
            <Checkbox
              status={checked ? "checked" : "unchecked"}
              onPress={handlePress}
              color="#31E3B9"
              uncheckedColor="#FFC700"
              disabled={!isToday}
            />
          </Center>
        </Box>
        <View style={styles.content}>
          <ThemedText style={[styles.title]}>{title}</ThemedText>
          <View style={styles.subtitles}>
            <ThemedText style={styles.subtitle}>{subtitle1}</ThemedText>
            <ThemedText style={styles.subtitleRight}>{subtitle2}</ThemedText>
          </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 5,
    width: '95%', // Reduce width by 5%
    marginLeft: 'auto', // Center the MedicineBox
    marginRight: 'auto', // Center the MedicineBox
    marginTop:'1%'
  },
  content: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitles: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  subtitle: {
    color: "#777",
  },
  subtitleRight: {
    color: "#777",
    textAlign: "right",
  },
});

export default MedicineBox;
