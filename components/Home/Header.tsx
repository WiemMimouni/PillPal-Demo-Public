import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { greenColor } from "@/constants/Colors";
import { ThemedView } from "components/ThemedView";
import { hp, wp } from "@/constants/ScreenSize";
import CustomCalendar from "./Calendar";
import { Path, Svg } from "react-native-svg";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Box, HStack } from "@gluestack-ui/themed";
export default function Header({
  onModalOpen,
  onModalClose,
  modal,
  selectedDate,
  setSelectedDate,
}: {
  onModalOpen: () => void;
  onModalClose: () => void;
  modal: Boolean;
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
}) {
  const [isPreviousWeekEnabled, setIsPreviousWeekEnabled] = useState(true);
  const [isNextWeekEnabled, setIsNextWeekEnabled] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    const minDate = new Date(currentYear, currentMonth - 2, currentDay);
    const maxDate = new Date(currentYear, currentMonth + 2, currentDay);

    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - (selectedDate.getDay() - 1));

    setIsPreviousWeekEnabled(startOfWeek > minDate);
    setIsNextWeekEnabled(startOfWeek < maxDate);
  }, [selectedDate]);
  useEffect(() => {
    if (modal) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [modal]);

  function getMonthAndYear(dateString: Date): string {
    const date = new Date(dateString);
    const monthNames = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];

    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${year}`;
  }
  const getWeekDays = (date: Date): { day: number; dayName: string }[] => {
    const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const result: { day: number; dayName: string }[] = [];

    const dayIndex = (date.getDay() + 6) % 7;
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - dayIndex);

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      result.push({
        day: currentDay.getDate(),
        dayName: daysOfWeek[(currentDay.getDay() + 6) % 7],
      });
    }

    return result;
  };

  const goToPreviousWeek = () => {
    const prevWeekDate = new Date(selectedDate);
    prevWeekDate.setDate(selectedDate.getDate() - 7);
    setSelectedDate(prevWeekDate);
  };

  const goToNextWeek = () => {
    const nextWeekDate = new Date(selectedDate);
    nextWeekDate.setDate(selectedDate.getDate() + 7);
    setSelectedDate(nextWeekDate);
  };
  const weekDays = getWeekDays(selectedDate);

  return (
    <ThemedView style={styles.container}>
      <Box
        style={{
          position: "absolute",
          top: hp(1),
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%", // Ensure the container spans the full width
          paddingHorizontal: 16, // Optional: Adds padding on both sides
        }}
      >
        <Box style={{ flex: 3 / 4 }}></Box>
        <Text style={styles.title}>{getMonthAndYear(selectedDate)}</Text>
        <TouchableOpacity onPress={() => onModalOpen()}>
        <MaterialCommunityIcons
          name="calendar-month"
          size={wp(7)}
          style={{ marginLeft: "auto" }}
        />

        </TouchableOpacity>
      </Box>
      <ThemedView style={styles.innerViewContainer}>
        {!modal && isPreviousWeekEnabled && (
          <TouchableOpacity onPress={goToPreviousWeek}>
            <Svg width={wp(6)} height={wp(6)} viewBox="0 0 24 24" fill="none">
              <Path
                d="M15 18l-6-6 6-6"
                stroke="#A5A3A3"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        )}
        {modal ? (
          <Animated.View style={{ opacity: fadeAnim }}>
            <CustomCalendar
              selectedDate={selectedDate}
              onDayPress={(day) => {
                onModalClose();
                setSelectedDate(new Date(day.dateString));
              }}
            />
          </Animated.View>
        ) : (
          weekDays.map((weekDay, index) => {
            const dayOffset =
              index -
              (weekDays.findIndex((d) => d.day === selectedDate.getDate()) ||
                0);
            const dayDate = new Date(selectedDate);
            dayDate.setDate(selectedDate.getDate() + dayOffset);

            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedDate(dayDate);
                }}
              >
                <View style={styles.dayContainer}>
                  <Text style={styles.dayName}>{weekDay.dayName}</Text>
                  <View
                    style={
                      weekDay.day === selectedDate.getDate() &&
                      styles.highlightedDayNumber
                    }
                  >
                    <Text
                      style={[
                        styles.dayNumber,
                        weekDay.day === selectedDate.getDate() && {
                          color: "white",
                        },
                      ]}
                    >
                      {weekDay.day}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}

        {!modal && isNextWeekEnabled && (
          <TouchableOpacity onPress={goToNextWeek}>
            <Svg width={wp(6)} height={wp(6)} viewBox="0 0 24 24" fill="none">
              <Path
                d="M9 6l6 6-6 6"
                stroke={"#A5A3A3"}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        )}
      </ThemedView>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: greenColor,
    zIndex: 23,
    marginBottom: hp(6),
    width: wp(100),
    height: hp(8),
  },
  highlightedDayNumber: {
    backgroundColor: greenColor,
    borderRadius: 50,
  },
  innerViewContainer: {
    transform: [{ translateY: 25 }],
    width: wp(95),

    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    top: hp(2),
  },
  dayContainer: {
    alignItems: "center",
    height: hp(6), // Adjust height to align names and numbers
    justifyContent: "center",
  },
  dayName: {
    fontSize: hp(1.75),
    color: "#A5A3A3",
  },
  dayNumber: {
    fontSize: hp(1.75),
    color: "black",
    padding: 5,
  },
  title: {
    flex: 1,
    textAlign: "left",
    color: "white",
    fontSize: hp(2),
  },

  weekDaysContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  arrow: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
});
