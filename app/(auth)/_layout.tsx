import { Stack } from "expo-router"
import React from "react";

const StackLayout = () => {
  return (
      <Stack>
          <Stack.Screen
              name="PhoneScreen"
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="PasswordScreen"
              options={{ headerShown: false }}
          />
      </Stack>
  );
}

export default StackLayout;
