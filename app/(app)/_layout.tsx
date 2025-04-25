import { Tabs } from "expo-router";
import "react-native-reanimated";
import { greenColor } from "@/constants/Colors";
import { hp, wp } from "@/constants/ScreenSize";
import { TabBarIcon } from "components/navigation/TabBarIcon";
import { CustomTabBarButton } from "components/navigation/CustomTabBarButton";
import { StyleSheet } from "react-native";
import CustomTabBarBackground from "components/navigation/CustomTabBarBackground";
import { useEffect } from "react";
import { useAuthContext } from "context/AuthContext";
import { useAuth } from "hooks/useAuth";
import {
  defineNotificationCategories,
  handleNotificationResponse,
  registerForPushNotifications,
} from "hooks/useLocalNotification";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import { usePushNotifications } from "hooks/usePushNotification";
interface TokenData {
  userId: string;
  firstname: string;
}
// TaskManager.defineTask(
//   "BACKGROUND_NOTIFICATION_TASK",
//   ({ data, error }: { data: any; error: any }) => {
//     if (error) {
//       console.error("Error in background notification task", error);
//       return;
//     }

//     if (data) {
//       const response = data.notification;
//       handleNotificationResponse(response);
//     }
//   }
// );
export default function RootLayout() {
  const { checkAuth, logout } = useAuth();
  const { setId ,setFirstName} = useAuthContext();
  const fetchId = async () => {
    const {userId,firstname} = await checkAuth() as TokenData    
    setFirstName(firstname);
    setId(userId);
  };
  usePushNotifications();

  useEffect(() => {
    defineNotificationCategories();
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("insede useEffect", response);
        handleNotificationResponse(response);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    fetchId();
  }, []);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarBackground: () => (
          <CustomTabBarBackground width={wp(100)} height={hp(12)} />
        ),
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          height: hp(15),
          elevation: 0,
          paddingBottom: 0,
          marginBottom: 0,
          paddingHorizontal: 0,
        },
      })}
    >
      <Tabs.Screen
        name="(tabs)"
        options={{
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="add" size={wp(7)} color={greenColor} />
          ),
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="+not-found"
        options={{ tabBarButton: (props) => null }}
      />
    </Tabs>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 0, // Ensure no extra padding
    marginBottom: 0, // Ensure no extra margin
  },
});
