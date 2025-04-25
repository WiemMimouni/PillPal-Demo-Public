import { GluestackUIProvider } from "@gluestack-ui/themed";
import { HeaderProvider } from "context/HeaderContext";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { AuthProvider } from "context/AuthContext";
import { useAuth } from "hooks/useAuth";
import { initializeDatabase } from "utils/sql/initializeDatabase";
import { bulkUploadMedicines, getMedicineByPct } from "utils/sql/medicine";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ActionSheetProvider } from "@expo/react-native-action-sheet";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [loaded] = useFonts({
    PoppinsBlack: require("assets/fonts/Poppins/Poppins-Black.ttf"),
    PoppinsBlackItalic: require("assets/fonts/Poppins/Poppins-BlackItalic.ttf"),
    PoppinsBold: require("assets/fonts/Poppins/Poppins-Bold.ttf"),
    PoppinsBoldItalic: require("assets/fonts/Poppins/Poppins-BoldItalic.ttf"),
    PoppinsExtraBold: require("assets/fonts/Poppins/Poppins-ExtraBold.ttf"),
    PoppinsExtraBoldItalic: require("assets/fonts/Poppins/Poppins-ExtraBoldItalic.ttf"),
    PoppinsExtraLight: require("assets/fonts/Poppins/Poppins-ExtraLight.ttf"),
    PoppinsExtraLightItalic: require("assets/fonts/Poppins/Poppins-ExtraLightItalic.ttf"),
    PoppinsItalic: require("assets/fonts/Poppins/Poppins-Italic.ttf"),
    PoppinsLight: require("assets/fonts/Poppins/Poppins-Light.ttf"),
    PoppinsLightItalic: require("assets/fonts/Poppins/Poppins-LightItalic.ttf"),
    PoppinsMedium: require("assets/fonts/Poppins/Poppins-Medium.ttf"),
    PoppinsMediumItalic: require("assets/fonts/Poppins/Poppins-MediumItalic.ttf"),
    PoppinsRegular: require("assets/fonts/Poppins/Poppins-Regular.ttf"),
    PoppinsSemiBold: require("assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    PoppinsSemiBoldItalic: require("assets/fonts/Poppins/Poppins-SemiBoldItalic.ttf"),
    PoppinsThin: require("assets/fonts/Poppins/Poppins-Thin.ttf"),
    PoppinsThinItalic: require("assets/fonts/Poppins/Poppins-ThinItalic.ttf"),
  });
  const { checkAuth, logout } = useAuth();
  useEffect(() => {

    if (loaded) {
      checkAuth();
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    getMedicineByPct("6943091H")
    if (!isInitializedRef.current) {
      checkDatabaseInitialization();
      isInitializedRef.current = true;
    }
  }, []);
  const checkDatabaseInitialization = async () => {
    try {
      const isDatabaseInitialized = await AsyncStorage.getItem(
        "database_initialized"
      );

      // await getMedicineByPct(""); // Perform bulk upload of medicines
      //  await AsyncStorage.removeItem("database_initialized");
      if (!isDatabaseInitialized) {
        await initializeDatabase();
        await bulkUploadMedicines();
        await AsyncStorage.setItem("database_initialized", "true");
        console.log("initialzed database");
      } else {
        console.log("database already initialized");
      }
    } catch (error) {
      console.error("Error checking database initialization:", error);
    }
  };
  if (!loaded) {
    return null;
  }
  return (
    <ActionSheetProvider>
      <AuthProvider>
        <HeaderProvider>
          <GluestackUIProvider>
            <Stack>
              {/* Optionally configure static options outside the route.*/}
              <Stack.Screen name="(Auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
              <Stack.Screen
                name="addMed/index"
                options={{ headerShown: false }}
              />
            </Stack>
          </GluestackUIProvider>
        </HeaderProvider>
      </AuthProvider>
    </ActionSheetProvider>
  );
}
