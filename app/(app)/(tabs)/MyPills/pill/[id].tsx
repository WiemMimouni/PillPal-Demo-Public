import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { wp, hp } from "@/constants/ScreenSize";
import CustomInput from "components/CustomInput";
import CustomButton from "components/CustomButton";
import TimePicker from "components/TimePicker";
import { Link } from "expo-router";
import axios from "utils/axios";
import { useAuthContext } from "context/AuthContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import { greenColor } from "@/constants/Colors";
import { ThemedText } from "components/ThemedText";
import NumberPicker from "components/NumberPicker";
import { useIsFocused } from "@react-navigation/native";

const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
type DataObject = {
  [key: string]: any;
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

const Index: React.FC = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [medicineName, setMedicineName] = useState<string>("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const [dailyIntake, setDailyIntake] = useState<string>("");
  const [intakeCount, setIntakeCount] = useState<number>(0);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<string[]>([]);
  const [treatmentDuration, setTreatmentDuration] = useState<string>("0");
  const [quantityTime, setQuantityTime] = useState<(number | string)[]>([]);
  const query = useLocalSearchParams();
  const [treatmentId, setTreatmentId] = useState<number>(
   0
  );
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const router = useRouter();
  
  const isFocused = useIsFocused();
  

  function decodeFromQuery(query: any): DataObject {
    const params = new URLSearchParams(query);
    const data: DataObject = {};

    for (const [key, value] of params.entries()) {
      const path = key.replace(/\]/g, "").split("[");
      let current: any = data;

      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
          current[path[i]] = isNaN(Number(path[i + 1])) ? {} : [];
        }
        current = current[path[i]];
      }

      const lastKey = path[path.length - 1];
      if (Array.isArray(current) && !isNaN(Number(lastKey))) {
        current[Number(lastKey)] = decodeURIComponent(value);
      } else {
        current[lastKey] = decodeURIComponent(value);
      }
    }

    return data;
  }

  const calculateTreatmentDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return durationInDays.toString();
  };

function fillStates():void{
const data = decodeFromQuery(query);
const times = data.timesAndQuantities.map((e: any) => e.time);
const quantities = data.timesAndQuantities.map((e: any) => e.quantity);
console.log(times);
if (data) {
  const medicineFullName = `${data.medicine?.medicinename} (${data.medicine?.dosage})`;
  setMedicineName(medicineFullName);
  setDailyIntake(data.timesAndQuantities.length.toString() || "");
  setTreatmentId(data.id);
  setSelectedTimes((prev) => (prev.length === times.length ? prev : times));
  setQuantities((prev) =>
    prev.length === quantities.length ? prev : quantities
  );
  setSelectedDays((prev) =>
    prev.length === data.dayofweek.length
      ? prev
      : daysOfWeek.filter((_, index) => data.dayofweek[index] === "true")
  );

  setTreatmentDuration(
    calculateTreatmentDuration(data.startDate, data.endDate)
  );
  setIntakeCount((prev) =>
    prev === data.timesperday?.length ? prev : data.timesperday?.length || 0
  );
  setQuantityTime((prev) =>
    prev.length === data.timesAndQuantities.length
      ? prev
      : data.timesAndQuantities
  );
}
}
  useEffect(() => {
    fillStates();
  }, [isFocused]);

  const adjustArrayLength = (Length: string): void => {
    let newLength = Number(Length);
    console.log(Length);

    if (newLength <= 0) {
      setQuantityTime([]);
      setSelectedTimes([]);
      setQuantities([]);
    } else if (newLength > quantityTime.length) {
      console.log(newLength, "inside iff");

      setQuantityTime((prevQuantityTime) =>
        [
          ...prevQuantityTime,
          ...Array(newLength - prevQuantityTime.length).fill(""),
        ].slice(0, newLength)
      );
      setSelectedTimes((prevSelectedTimes) =>
        [
          ...prevSelectedTimes,
          ...Array(newLength - prevSelectedTimes.length).fill(""),
        ].slice(0, newLength)
      );
      setQuantities((prevQuantities) =>
        [
          ...prevQuantities,
          ...Array(newLength - prevQuantities.length).fill(""),
        ].slice(0, newLength)
      );
    } else {
      setQuantityTime((prevQuantityTime) =>
        prevQuantityTime.slice(0, newLength)
      );
      setSelectedTimes((prevSelectedTimes) =>
        prevSelectedTimes.slice(0, newLength)
      );
      setQuantities((prevQuantities) => prevQuantities.slice(0, newLength));
    }
  };

  const handleTimeChange = (index: number, time: string) => {
    const newSelectedTimes = [...selectedTimes];
    newSelectedTimes[index] = time;
    setSelectedTimes(newSelectedTimes);
  };

  const handleQuantityChange = (index: number, quantity: string) => {
    const newQuantities = [...quantities];
    newQuantities[index] = quantity;
    setQuantities(newQuantities);
  };

  const handleCancel = async () => {
    try {
      await axios.patch(`/treatment/${treatmentId}/cancel`);
      router.back();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    setLoadingUpdate(true); // Start loading
    try {
      const response = await axios.patch(`/treatment/${treatmentId}`, {
        timesperday: selectedTimes,
        quantity: quantities.map((e) => JSON.parse(e)),
      });
      router.back();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingUpdate(false); // End loading
    }
  };

  const renderForm = () => (
    <View style={styles.pageContainer}>
      <Text style={styles.title}>mettre a jour le traitement</Text>
      <View style={{ alignSelf: "flex-start" }}>
        <ThemedText type="subtitle">Nom du medicament</ThemedText>
      </View>
      <View style={styles.medicineContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: "https://res.cloudinary.com/dqz0n291c/image/upload/v1718809180/Group_1000001857_cb8s9m.png",
            }}
            style={styles.medicineIcon}
          />
        </View>
        <View style={styles.medicineTextContainer}>
          <ThemedText type="defaultSemiBold" style={styles.medicineBox}>
            {truncateText(medicineName, 25)}
          </ThemedText>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.halfInputContainer}>
          <NumberPicker
            label="Prise journaliére"
            selectedTime={quantityTime?.length.toString()}
            onSelectTime={(number) => adjustArrayLength(number)}
            lengthArray={10}
          />
        </View>
      </View>

      {quantityTime.map((item, index) => (
        <View key={index} style={styles.row}>
          <View style={styles.halfInputContainer}>
            <TimePicker
              label={`Heure ${index + 1}`}
              selectedTime={selectedTimes[index]}
              onSelectTime={(time) => handleTimeChange(index, time)}
            />
          </View>
          <CustomInput
            label={`Quantité ${index + 1}`}
            containerStyle={styles.halfInputContainer}
            keyboardType="numeric"
            value={quantities[index]}
            onChangeText={(quantity) => handleQuantityChange(index, quantity)}
          />
        </View>
      ))}
      <CustomButton
        title="Stopper le traitement"
        onPress={handleCancel}
        containerStyle={styles.buttonContainer1}
        textStyle={styles.buttonText1}
      />
      {loadingUpdate ? (
        <ActivityIndicator size="large" color="#1AC29A" />
      ) : (
        <CustomButton
          title="confirmer le traitement"
          onPress={handleSubmit}
          containerStyle={styles.buttonContainer}
          textStyle={styles.buttonText}
        />
      )}
      <Link href={"/MyPills"} style={styles.backButton}>
        <Text style={styles.backButtonText}>Annuler</Text>
      </Link>
    </View>
  );

  return (
    <FlatList
      data={[{ key: "form" }, ...suggestions]}
      renderItem={({ item }) => renderForm()}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

export default Index;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollView: {
    flexGrow: 1,
  },
  pageContainer: {
    flex: 1,
    alignItems: "center",
    padding: wp("5%"),
    paddingBottom: hp(18),
  },
  title: {
    fontSize: wp("6%"),
    fontFamily: "PoppinsBold",
    color: "#000",
    marginVertical: hp("2%"),
  },
  subtitle: {
    fontSize: wp("4%"),
    fontFamily: "PoppinsLight",
    color: "#A5A3A3",
    marginBottom: hp("2%"),
  },
  input: {
    height: hp("6%"),
    fontSize: wp("4%"),
  },
  inputContainer: {
    width: wp("90%"),
    marginVertical: hp("1%"),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: wp("90%"),
  },
  halfInputContainer: {
    width: wp("43%"),
    marginVertical: hp("1%"),
  },
  scheduleTitle: {
    fontSize: wp("4.3%"),
    fontFamily: "PoppinsRegular",
    color: "#666161",
    marginTop: hp("3%"),
    alignSelf: "flex-start",
    width: wp("90%"),
  },
  daysContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 5,
    padding: wp("2%"),
    marginTop: hp("2%"),
    width: wp("90%"),
    justifyContent: "space-between",
  },
  buttonContainer: {
    width: wp("80%"),
    marginVertical: hp("1%"),
  },
  buttonText: {
    fontSize: wp("4%"),
  },
  buttonContainer1: {
    width: wp("80%"),
    marginVertical: hp("1%"),
    backgroundColor: "transparent",
    borderColor: "#E33131",
    borderWidth: 0.5,
  },
  buttonText1: {
    fontSize: wp("4%"),
    color: "#F93C30",
  },
  backButton: {
    marginTop: hp("0.2%"),
    alignItems: "center",
  },
  backButtonText: {
    textDecorationLine: "underline",
    color: "grey",
  },
  day: {
    padding: wp("2%"),
    borderRadius: 5,
    marginHorizontal: wp("1%"),
  },
  selectedDay: {
    backgroundColor: "#31E3B9",
  },
  dayText: {
    color: "#A5A3A3",
    fontFamily: "PoppinsMedium",
  },
  selectedDayText: {
    color: "white",
  },
  suggestionsList: {
    width: wp("90%"),
    maxHeight: hp("20%"),
    backgroundColor: "#FFF",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: hp("1%"),
  },
  suggestionItem: {
    padding: wp("2%"),
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  back: {
    fontSize: wp("4%"),
    alignSelf: "flex-start",
    fontFamily: "PoppinsBold",
    color: greenColor,
  },
  medicineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  imageContainer: {
    width: 67,
    height: 67,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#31E3B9",
    marginRight: -10,
  },
  medicineIcon: {
    width: 50,
    height: 50,
    borderRadius: 20,
  },
  medicineTextContainer: {
    flexDirection: "column",
    backgroundColor: "rgba(49, 227, 185, 0.28)",
    borderRadius: 10,
    padding: 5,
    justifyContent: "center", // Center the text vertically
    alignItems: "center", // Center the text horizontally
  },
  medicineBox: {
    paddingHorizontal: 10, // Add horizontal padding
  },
});
