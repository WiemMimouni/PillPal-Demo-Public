import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  ScrollView,
  Text,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import { Collapsible } from "@/components/Collapsible";
import MedicineBox from "@/components/MedicineBox";
import { ThemedView } from "@/components/ThemedView";
import Header from "@/components/Home/Header";
import axios from "@/utils/axios";
import { hp, wp } from "@/constants/ScreenSize";
import { useAuthContext } from "context/AuthContext";
import Feather from "react-native-vector-icons/Feather";
import { BlurView } from "expo-blur";
import { sendPushNotification } from "hooks/useLocalNotification";
import { useFocusEffect, useNavigation } from "expo-router";

interface Treatment {
  medicine: {
    medicinename: string;
    dosage: string;
    forme: string;
  };
  quantity: string;
}

interface ScheduleItem {
  mealtype: string;
  schdule_id: number;
  state: boolean;
  timeofreceipt: Date;
  treatment: Treatment;
  treatmentid: number;
}

const Home: React.FC = () => {
  const [isMedicineModalOpen, setIsMedicineModalOpen] =
    useState<boolean>(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] =
    useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [matin, setMatin] = useState<ScheduleItem[]>([]);
  const [midi, setMidi] = useState<ScheduleItem[]>([]);
  const [soir, setSoir] = useState<ScheduleItem[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<ScheduleItem | null>(
    null
  );
  const { id, firstname } = useAuthContext();
  const navigation = useNavigation();

  const handleMedicineModalOpen = (medicine: ScheduleItem) => {
    setSelectedMedicine(medicine);
    setIsMedicineModalOpen(true);
  };

  const handleMedicineModalClose = () => {
    setIsMedicineModalOpen(false);
    setSelectedMedicine(null);
  };

  const handleCalendarModalOpen = () => {
    setIsCalendarModalOpen(true);
  };

  const handleCalendarModalClose = () => {
    setIsCalendarModalOpen(false);
  };

  const handleStateChange = async (scheduleId: number, newState: boolean) => {
    try {
      console.log(
        `Sending request to update scheduleId: ${scheduleId} with newState: ${newState}`
      );
      const response = await axios.patch(`/schedules/${scheduleId}`, {
        state: newState,
      });
      console.log("Response from server:", response.data);

      // Update the state locally after a successful response
      const updateState = (items: ScheduleItem[]) =>
        items.map((item) =>
          item.schdule_id === scheduleId ? { ...item, state: newState } : item
        );

      setMatin(updateState(matin));
      setMidi(updateState(midi));
      setSoir(updateState(soir));

      console.log("State updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating state:", error);
    }
  };
  const fetchTreatments = async () => {
    try {
      const response = await axios.get(
        `/treatment/user/${id}/schedules?date=${
          selectedDate.toISOString().split("T")[0]
        }`
      );

      // [
      //   ...response.data.matin,
      //   ...response.data.midi,
      //   ...response.data.soir,
      // ].forEach((item: ScheduleItem) => {
      //   if (new Date() < new Date(item.timeofreceipt)) {
      //     sendPushNotification(item.timeofreceipt, item);
      //   }
      // });
      setMatin(response.data.matin || []);
      setMidi(response.data.midi || []);
      setSoir(response.data.soir || []);
    } catch (error) {
      console.error("Error fetching treatments:", error);
    }
  };
  useEffect(() => {
    if (id) {
      fetchTreatments();
    }
  }, [selectedDate, id]);

  const truncateMedicineName = (name: string, maxLength: number) => {
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + "...";
    }
    return name;
  };

  const formatTime = (dateString: Date) => {
    const date = new Date(dateString);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  const isToday = (isoDate: Date): boolean => {
    const inputDate = new Date(isoDate);
    const today = new Date();

    return (
      inputDate.getDate() === today.getDate() &&
      inputDate.getMonth() === today.getMonth() &&
      inputDate.getFullYear() === today.getFullYear()
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      if (id) {
        console.log("referxh");

        fetchTreatments();
      }
    }, [selectedDate, id, navigation])
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <Header
        onModalOpen={handleCalendarModalOpen}
        modal={isCalendarModalOpen}
        onModalClose={handleCalendarModalClose}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <View style={{ flex: 1 }}>
        {isMedicineModalOpen && (
          <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill}>
            <TouchableWithoutFeedback onPress={handleMedicineModalClose}>
              <View style={styles.overlay} />
            </TouchableWithoutFeedback>
          </BlurView>
        )}
        <ThemedView
          style={[styles.container, isMedicineModalOpen && styles.blurred]}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            style={styles.scrollView}
          >
            <Collapsible title="Matin" iconSource={require('@/assets/images/Group 1000001880.png')}>
              {matin.map((item) => (
                <MedicineBox
                  key={item.schdule_id}
                  title={item.treatment.medicine.medicinename}
                  subtitle1={formatTime(item.timeofreceipt)}
                  subtitle2={`${item.treatment.quantity}x pilule/prise`}
                  initialChecked={item.state}
                  onChange={() =>
                    handleStateChange(item.schdule_id, !item.state)
                  }
                  isToday={isToday(item.timeofreceipt)}
                  onPress={() => handleMedicineModalOpen(item)}
                />
              ))}
            </Collapsible>
            <Collapsible title="Midi" iconSource={require('@/assets/images/Group 1000001879.png')}>
              {midi.map((item) => (
                <MedicineBox
                  key={item.schdule_id}
                  title={item.treatment.medicine.medicinename}
                  subtitle1={formatTime(item.timeofreceipt)}
                  subtitle2={`${item.treatment.quantity}x pilule/prise`}
                  initialChecked={item.state}
                  isToday={isToday(item.timeofreceipt)}
                  onChange={() =>
                    handleStateChange(item.schdule_id, !item.state)
                  }
                  onPress={() => handleMedicineModalOpen(item)}
                />
              ))}
            </Collapsible>
            <Collapsible title="Nuit" iconSource={require('@/assets/images/Group 1000001881.png')}>
              {soir.map((item) => (
                <MedicineBox
                  key={item.schdule_id}
                  title={item.treatment.medicine.medicinename}
                  subtitle1={formatTime(item.timeofreceipt)}
                  subtitle2={`${item.treatment.quantity}x pilule/prise`}
                  initialChecked={item.state}
                  isToday={isToday(item.timeofreceipt)}
                  onChange={() =>
                    handleStateChange(item.schdule_id, !item.state)
                  }
                  onPress={() => handleMedicineModalOpen(item)}
                />
              ))}
            </Collapsible>
          </ScrollView>
        </ThemedView>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isMedicineModalOpen}
        onRequestClose={handleMedicineModalClose}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.modalView}>
            {selectedMedicine && (
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity
                    onPress={handleMedicineModalClose}
                    style={styles.closeButton}
                  >
                    <Feather name="x" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
                <View style={styles.modalBody}>
                  <View style={styles.modalTitleContainer}>
                    <View style={styles.modalImageContainer}>
                      <Image
                        source={{
                          uri: "https://res.cloudinary.com/dqz0n291c/image/upload/v1718809180/Group_1000001857_cb8s9m.png",
                        }} // Placeholder image URL
                        style={styles.modalImage}
                      />
                    </View>
                    <Text style={styles.modalTitle}>
                      {truncateMedicineName(
                        selectedMedicine.treatment.medicine.medicinename,
                        15
                      )}
                    </Text>
                  </View>
                  <Text style={styles.modalText}>
                    <Feather name="calendar" size={16} color="#666" /> Scheduled
                    for{" "}
                    {new Date(
                      selectedMedicine.timeofreceipt
                    ).toLocaleTimeString()}
                    , Today
                  </Text>
                  <Text style={styles.modalText}>
                    <Feather name="layers" size={16} color="#666" />{" "}
                    {selectedMedicine.treatment.medicine.dosage} , take{" "}
                    {selectedMedicine.treatment.quantity} Applications
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop:30
  },
  blurred: {
    opacity: 0.1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.5)", // White background with 10% opacity
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: hp("15%"), // Adding bottom padding to avoid overlapping with the tab view
  },
  scrollView: {
    flex: 1,
    height: hp("80%"),
  },
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: wp("80%"),
    height: hp("25%"), // Increased the height of the modal
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContent: {
    width: "100%",
    alignItems: "flex-start",
  },
  modalHeader: {
    backgroundColor: "#31E3B9",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    alignItems: "flex-end",
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  modalBody: {
    padding: 10,
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20, // Increased gap
  },
  modalImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#31E3B9",
    borderRadius: 10,
    padding: 5,
    marginRight: 10,
  },
  modalImage: {
    width: 40,
    height: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
});
