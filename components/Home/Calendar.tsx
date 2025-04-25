import { greenColor } from "@/constants/Colors";
import { hp } from "@/constants/ScreenSize";
import React from "react";
import { Calendar, CalendarProps } from "react-native-calendars";

const CustomCalendar = ({
  selectedDate,
  ...props
}: CalendarProps & { selectedDate: Date }) => {
  const today = new Date();
  const marked = {
    [selectedDate.toISOString().split("T")[0]]: {
      selected: true,
      selectedColor: greenColor,
    },
  };

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const minDate = new Date(currentYear, currentMonth - 2, currentDay);

  const maxDate = new Date(currentYear, currentMonth + 2, currentDay);

  return (
    <Calendar
      initialDate={selectedDate.toISOString().split("T")[0]}
      minDate={minDate.toISOString().split("T")[0]}
      maxDate={maxDate.toISOString().split("T")[0]}
      disableAllTouchEventsForDisabledDays={true}
      firstDay={1}
      markedDates={marked}
      {...props}
      enableSwipeMonths
      theme={{
        textDayFontSize: hp(1.75),
        textDayHeaderFontSize: hp(1.25),
        dayTextColor: "black",
        arrowColor: "#A5A3A3",
      }}
    />
  );
};

export default CustomCalendar;
