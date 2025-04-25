import { Drawer } from "expo-router/drawer";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors, greenColor } from "@/constants/Colors";
import Header from "components/navigation/Header";
import CustomDrawerContent from "components/navigation/CustomDrawer";
import { hp, wp } from "@/constants/ScreenSize";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

export default function TabLayout() {
  return (
      <Drawer
        initialRouteName="Home/index"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerType: "front",
          drawerActiveTintColor: "black",
          drawerInactiveTintColor: greenColor,
          drawerActiveBackgroundColor: "#000",
          header: ({ navigation }) => <Header navigation={navigation} />,
          drawerContentStyle: { backgroundColor: "white" },
          drawerLabelStyle: { color: greenColor },
          overlayColor: "rgba(255, 255, 255, 0.8)",
          drawerStyle: {
            width: wp(60),
            marginTop: hp(10), // Adjust this value to create the desired space at the top
            backgroundColor: "transparent", // Ensure the drawer itself is transparent
            shadowColor: "#000", // Shadow color
            shadowOffset: { width: 0, height: 4 }, // Increase shadow offset height
            shadowOpacity: 0.5, // Increase shadow opacity
            shadowRadius: 6, // Increase shadow radius
            elevation: 10, // Increase elevation for Android
          },
          drawerItemStyle: { marginLeft: 0 },
        }}
      >
        <Drawer.Screen
          name="Home/index"
          options={{
            title: "Accueil",
            drawerIcon: ({ color, focused }) => (
              <TabBarIcon size={wp(9)} name={"home-outline"} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="MyPills/index"
          options={{
            title: "Mes traitement",
            drawerIcon: ({ color, focused }) => (
              <TabBarIcon size={wp(14)} name={"medkit-outline"} color={color} />
            ),
          }}
        />
    
        <Drawer.Screen
          name="Files/index"
          options={{
            title: "Fichiers",
            drawerIcon: ({ color, focused }) => (
              <TabBarIcon size={wp(9)} name={"book-outline"} color={color} />
            ),
          }}
        />
<Drawer.Screen
          name="UploadImages/index"
          options={{
            title: "upload",
            drawerItemStyle:{display:"none"}
          }}
        />
        <Drawer.Screen
          name="MyPills/pill/[id]"
          options={{
            title: "pill",
            
            drawerItemStyle:{display:"none"}
          }}
        />
            <Drawer.Screen
          name="Profile/index"
          options={{
            title: "Profile",
            drawerIcon: ({ color, focused }) => (
              <TabBarIcon
                size={wp(9)}
                name={"person-outline"}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Settings/index"
          options={{
            title: "Paramètres",
            drawerIcon: ({ color, focused }) => (
              <TabBarIcon
                size={wp(9)}
                name={"settings-outline"}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Pharmacies/index"
          options={{
            title: "Pharmacies",
            drawerIcon: ({ color, focused }) => (
              <TabBarIcon
                size={wp(9)}
                name={"storefront-outline"}
                color={color}
              />
            ),
          }}
        />
      
        
      </Drawer>
  );
}
