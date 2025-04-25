import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Text,
  ScrollView,
} from "react-native";
import { wp, hp } from "@/constants/ScreenSize";
import CustomInput from "components/CustomInput";
import CustomButton from "components/CustomButton";
import TimePicker from "components/TimePicker";
import { Link, router } from "expo-router";
import axios from "utils/axios";
import { useAuthContext } from "context/AuthContext";
import { useHeader } from "context/HeaderContext";
import { sendPushNotification } from "hooks/useLocalNotification";

const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const Index: React.FC = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Lun",
    "Mar",
    "Mer",
    "Jeu",
    "Ven",
    "Sam",
    "Dim",
  ]);
  const [medicineName, setMedicineName] = useState<string>("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [dailyIntake, setDailyIntake] = useState<string>("");
  const [intakeCount, setIntakeCount] = useState<number>(0);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<string[]>([]);
  const [treatmentDuration, setTreatmentDuration] = useState<string>("");
  const [PharmacyCode, setPharmacyCode] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | undefined>(undefined);
  const { id } = useAuthContext();
  const { setScreenName } = useHeader(); // Access screen name from the header context

  const toggleDaySelection = (day: string) => {
    setSelectedDays((prevSelectedDays) =>
      prevSelectedDays.includes(day)
        ? prevSelectedDays.filter((selectedDay) => selectedDay !== day)
        : [...prevSelectedDays, day]
    );
  };

  useEffect(() => {
    if (medicineName.length >= 3) {
      fetchSuggestions(medicineName);
    } else {
      setSuggestions([]);
      setSelectedMedicine(null);
    }
  }, [medicineName]);

  const fetchSuggestions = async (query: string) => {
    setLoadingSuggestions(true);
    try {
      const response = await axios.get(`/medicine/search?designation=${query}`);
      const medicineNames = response.data.content.map((item: any) => ({
        name: `${item.medicinename} (${item.dosage})`,
        ...item,
      }));
      setSuggestions(medicineNames);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion: any) => {
    setMedicineName(suggestion.name);
    setSelectedMedicine(suggestion);
    setSuggestions([]);
  };

  useEffect(() => {
    const count = parseInt(dailyIntake, 10);
    if (!isNaN(count)) {
      setIntakeCount(count);
      setSelectedTimes(Array(count).fill(""));
      setQuantities(Array(count).fill("0"));
    } else {
      setIntakeCount(0);
      setSelectedTimes([]);
      setQuantities([]);
    }
  }, [dailyIntake]);

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

  const handleSubmit = async () => {
    if (!selectedMedicine) {
      console.log("Please select a valid medicine.");
      return;
    }

    const daysOfWeekBoolean = daysOfWeek.map((day) =>
      selectedDays.includes(day) ? true : false
    );
    console.log(
      quantities.map((qty) => parseFloat(qty)),
      quantities
    );

    const treatmentData = {
      medicineid: selectedMedicine.amm,
      userid: Number(id),
      treatmentDuration: parseInt(treatmentDuration, 10),
      dayofweek: daysOfWeekBoolean,
      mealtype: "middle",
      timesperday: selectedTimes,
      quantity: quantities.map((qty) => parseFloat(qty)),
      pharmacy_code: PharmacyCode,
    };

    console.log("Treatment Data:", treatmentData);

    setLoadingSubmit(true); // Start loading submit

    try {
      const response = await axios.post("/treatment", treatmentData);
      console.log("Success:--------", response.data.allCreatedSchedule);
      const data = response.data;
      data.allCreatedSchedule.forEach((time: any, index: number) => {
        console.log(
          "quantity",
          time
        );

        sendPushNotification(time.timeofreceipt, {
          name: data.medicineInfo.medicinename,
          quantity:
            data?.timeAndQuantity[index % data.timeAndQuantity.length]
              ?.quantity,
          time: data?.timeAndQuantity[index % data.timeAndQuantity.length]
            ?.time,
          schdule_id: response.data.allCreatedSchedule.schdule_id,
        });
      });
      setScreenName("home");
      router.back();
    } catch (error: { message: string } | any) {
      if (error.message.includes("404")) {
        setErrorText("entrer un code de pharmacy valid");
      }
      console.error("Error:", error.message);
    } finally {
      setLoadingSubmit(false); // End loading submit
    }
  };

  const handlePharmacy = () => {
    typeof PharmacyCode == "string"
      ? setPharmacyCode(null)
      : setPharmacyCode("");
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.pageContainer}>
          <Text style={styles.title}>Add medicine</Text>
          <CustomButton
            title={
              !(typeof PharmacyCode == "string")
                ? "ajouter code"
                : "retirer code"
            }
            onPress={handlePharmacy}
            containerStyle={styles.buttonContainer}
            textStyle={styles.buttonText}
          />
          {typeof PharmacyCode == "string" && (
            <CustomInput
              keyboardType="default"
              label="Code de Pharamacy"
              containerStyle={styles.inputContainer}
              inputStyle={styles.input}
              value={PharmacyCode}
              error={errorText}
              onChangeText={setPharmacyCode}
            />
          )}

          <CustomInput
            keyboardType="default"
            label="Nom du médicament"
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
            value={medicineName}
            onChangeText={setMedicineName}
            placeholder="Veuillez taper le nom du médicament"
          />
          {loadingSuggestions && (
            <ActivityIndicator size="large" color="#1AC29A" />
          )}
          {suggestions.length > 0 && (
            <FlatList
              data={suggestions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSuggestionSelect(item)}>
                  <Text style={styles.suggestionItem}>{item.name}</Text>
                </TouchableOpacity>
              )}
              style={styles.suggestionsList}
            />
          )}
          <View style={styles.row}>
            <CustomInput
              label="Prise journaliére"
              containerStyle={styles.halfInputContainer}
              keyboardType="numeric"
              value={dailyIntake}
              onChangeText={setDailyIntake}
              placeholder="0"
            />
            <CustomInput
              label="Durée du traitement"
              containerStyle={styles.halfInputContainer}
              keyboardType="numeric"
              value={treatmentDuration}
              onChangeText={(value) => setTreatmentDuration(value)}
              placeholder="0"
            />
          </View>
          {Array.from({ length: intakeCount }).map((_, index) => (
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
                onChangeText={(quantity) =>
                  handleQuantityChange(index, quantity)
                }
              />
            </View>
          ))}
          <Text style={styles.scheduleTitle}>Schedule</Text>
          <View style={styles.daysContainer}>
            {daysOfWeek.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.day,
                  selectedDays.includes(day) && styles.selectedDay,
                ]}
                onPress={() => toggleDaySelection(day)}
              >
                <Text
                  style={[
                    styles.dayText,
                    selectedDays.includes(day) && styles.selectedDayText,
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {loadingSubmit ? (
            <ActivityIndicator size="large" color="#1AC29A" />
          ) : (
            <CustomButton
              title="Générer"
              onPress={handleSubmit}
              containerStyle={styles.buttonContainer}
              textStyle={styles.buttonText}
            />
          )}
          <Link href={"Home"} style={styles.backButton}>
            <Text style={styles.backButtonText}>Annuler</Text>
          </Link>
        </View>
      </ScrollView>
    </View>
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
  },
  title: {
    fontSize: wp("6%"),
    fontFamily: "PoppinsBold",
    color: "#FFFFFF",
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
    width: wp("97%"),
    // justifyContent: "space-between",
  },
  buttonContainer: {
    width: wp("80%"),
    marginVertical: hp("1%"),
  },
  buttonText: {
    fontSize: wp("4%"),
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
    marginHorizontal: wp("0.5%"),
    marginRight: "2%",
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
});
