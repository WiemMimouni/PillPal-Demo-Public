import React from "react";
import { Stack } from "expo-router/stack";
import { AuthProvider } from "context/AuthContext";

const AuthStack: React.FC = () => {
  return (
    <Stack  screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login/index" options={{ headerShown: false }} />
      <Stack.Screen name="OTP/index" options={{ headerShown: false }} />
      <Stack.Screen
        name="Forget-Password/index"
        options={{ title: "Forgot Password" }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};

export default AuthStack;
