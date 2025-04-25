import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { wp, hp } from "@/constants/ScreenSize";
import axios from "@/utils/axios";
import { useAuthContext } from "context/AuthContext";
import { useLinkTo } from "@react-navigation/native";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { useHeader } from "context/HeaderContext";
type DataObject = {
  [key: string]: any;
};
const History = () => {
  function encodeToQuery(data: DataObject): string {
    const buildQuery = (obj: DataObject, prefix: string = ""): string => {
      return Object.keys(obj)
        .map((key) => {
          const fullKey = prefix ? `${prefix}[${key}]` : key;
          const value = obj[key];

          if (value && typeof value === "object") {
            if (Array.isArray(value)) {
              // Handle array separately to ensure each element gets properly encoded
              return value
                .map((val, i) => {
                  if (typeof val === "object") {
                    // Recursively handle objects in arrays
                    return buildQuery(val, `${fullKey}[${i}]`);
                  }
                  return `${fullKey}[${i}]=${encodeURIComponent(val)}`;
                })
                .join("&");
            } else {
              // Recursively handle nested objects
              return buildQuery(value, fullKey);
            }
          }

          return `${fullKey}=${encodeURIComponent(value)}`;
        })
        .join("&");
    };

    return buildQuery(data);
  }

  const [currentView, setCurrentView] = useState<"En cours" | "terminé">(
    "En cours"
  );
  const [treatments, setTreatments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useAuthContext();
  const linkTo = useLinkTo();
  const { screenName, setScreenName } = useHeader(); // Access screen name from the header context
  useEffect(() => {
    setScreenName("My pills");
  }, []);

  const fetchTreatments = async () => {
    try {
      const response = await axios.get(`/treatment/user/${id}`);
      setTreatments(response.data);
    } catch (error) {
      console.error("Error fetching treatments:", error);
    } finally {
      setLoading(false);
    }
  };

  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      if (id) {
        console.log("referxh");

        fetchTreatments();
        setScreenName("My pills");
      }
    }, [id, navigation])
  );

  const Box = ({ item }: { item: any }) =>
    currentView === "En cours" ? (
      <TouchableOpacity
        style={styles.box}
        onPress={() => {
          const query = JSON.stringify(item);

          router.navigate(
            `/MyPills/pill/${item.treatmentid}?${encodeToQuery(item)}`
          );
        }}
      >
        <Image
          source={require("assets/images/Group 1000001857.png")}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={styles.boxTitle} numberOfLines={1} ellipsizeMode="tail">
            {`${item.medicine.medicinename} ${item.medicine.dosage}`}
          </Text>
          <Text
            style={styles.boxSubtitle}
          >{`${item.timesAndQuantities.length} times per day`}</Text>
        </View>
      </TouchableOpacity>
    ) : (
      <View style={styles.box}>
        <Image
          source={require("assets/images/Group 1000001857.png")}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={styles.boxTitle} numberOfLines={1} ellipsizeMode="tail">
            {`${item.medicine.medicinename} ${item.medicine.dosage}`}
          </Text>
          <Text
            style={styles.boxSubtitle}
          >{`${item.timesAndQuantities.length} times per day`}</Text>
        </View>
      </View>
    );

  const renderContent = () => {
    if (loading) {
      return <Text>Loading...</Text>;
    }

    const data =
      treatments?.filter((treatment) =>
        currentView === "En cours" ? treatment.ongoing : !treatment.ongoing
      ) || [];

    if (data.length === 0) {
      return <Text>No data available</Text>;
    }

    return data.map((item) => <Box key={item.treatmentid} item={item} />);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            currentView === "En cours" && styles.activeButton,
          ]}
          onPress={() => setCurrentView("En cours")}
        >
          <Text
            style={[
              styles.buttonText,
              currentView === "En cours" && styles.activeButtonText,
            ]}
          >
            En cours
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            currentView === "terminé" && styles.activeButton,
          ]}
          onPress={() => setCurrentView("terminé")}
        >
          <Text
            style={[
              styles.buttonText,
              currentView === "terminé" && styles.activeButtonText,
            ]}
          >
            terminé
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
};

export default History;

export const styles = StyleSheet.create({
  scroll: {
    width: "95%",
    alignSelf: "center",
  },
  scrollContent: {
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingTop: hp("2%"),
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: hp(15),
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: wp("5%"),
    marginBottom: hp("2%"),
  },
  button: {
    padding: wp("2%"),
    borderRadius: 10,
    backgroundColor: "transparent", // Default background color
  },
  activeButton: {
    backgroundColor: "#5BD1B8", // Active button background color
  },
  buttonText: {
    fontSize: wp("4%"),
    color: "#A5A3A3", // Default text color
    textAlign: "center",
    fontWeight: "300",
    fontFamily: "PoppinsRegular",
  },
  activeButtonText: {
    color: "#fff", // Active button text color
  },
  component: {
    padding: wp("5%"),
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  box: {
    width: "85%",
    flexDirection: "row",
    backgroundColor: "rgba(217, 217, 217, 0.28)",
    borderRadius: 10,
    padding: wp("4%"),
    marginVertical: hp("0.4%"),
    alignItems: "center",
  },
  image: {
    width: wp("10%"),
    height: wp("10%"),
    marginRight: wp("3%"),
  },
  textContainer: {
    flex: 1,
    justifyContent: "center", // Center the text vertically
    alignItems: "flex-start", // Align text to the left within the container
    marginLeft: wp("5%"),
  },
  boxTitle: {
    fontSize: wp("4%"),
    color: "#000",
    fontFamily: "PoppinsRegular",
  },
  boxSubtitle: {
    fontSize: wp("3.5%"),
    color: "#666",
    fontFamily: "PoppinsLight",
    fontWeight: "200",
  },
});
