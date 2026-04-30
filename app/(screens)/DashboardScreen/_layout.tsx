import { Stack } from "expo-router"
import Toast from "react-native-toast-message";
import React from "react";

const StackLayout = () => {
  return (
      <>
        <Stack>
          <Stack.Screen
              name="index"
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="ProfileScreen"
              options={{ headerShown: false }}
          />
            <Stack.Screen
                name="LoyaltyScreen"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="FireStreakScreen"
                options={{ headerShown: false }}
            />
        </Stack>
        <Toast />
      </>
  );
}
//<Toast config={toastConfig} />
export default StackLayout;
