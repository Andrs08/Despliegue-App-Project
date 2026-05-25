import React from "react";
import { StatusBar } from "expo-status-bar";
import { AppNavigator } from "./src/core/navigation/app_navigator";

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
}