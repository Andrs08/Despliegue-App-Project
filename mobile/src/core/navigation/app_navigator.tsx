import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LoginPage } from "../../features/auth/ui/pages/login_page";
import { RegisterPage } from "../../features/auth/ui/pages/register_page";
import { ForgotPasswordPage } from "../../features/auth/ui/pages/forgot_password_page";
import { VerificationCodePage } from "../../features/auth/ui/pages/verification_code_page";
import { ResetPasswordPage } from "../../features/auth/ui/pages/reset_password_page";

import { DashboardPage } from "../../features/dashboard/ui/pages/dashboard_page";

import { BitacorasPage } from "../../features/bitacora/ui/pages/bitacoras_page";
import { AddBitacoraPage } from "../../features/bitacora/ui/pages/add_bitacora_page";

import { ProfilePage } from "../../features/profile/ui/pages/profile_page";
import { EditProfilePage } from "../../features/profile/ui/pages/edit_profile_page";

import { PlaceholderPage } from "../../shared/ui/placeholder_page";

export type BitacoraRouteItem = {
  id: number;
  title: string;
  lot: string;
  description: string;
  imageUri?: string | null;
  createdAt: string;
};

export type UserProfileRouteItem = {
  fullName: string;
  email: string;
  imageUri?: string | null;
};

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;

  VerificationCode: {
    email: string;
  };

  ResetPassword: {
    email: string;
  };

  Dashboard: undefined;

  Bitacoras: undefined;

  AddBitacora:
    | {
        mode: "create";
      }
    | {
        mode: "edit";
        bitacora: BitacoraRouteItem;
      };

  Zones: undefined;
  Notifications: undefined;

  Profile: undefined;

  EditProfile: {
    user: UserProfileRouteItem;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginPage} />

        <Stack.Screen name="Register" component={RegisterPage} />

        <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />

        <Stack.Screen
          name="VerificationCode"
          component={VerificationCodePage}
        />

        <Stack.Screen name="ResetPassword" component={ResetPasswordPage} />

        <Stack.Screen name="Dashboard" component={DashboardPage} />

        <Stack.Screen name="Bitacoras" component={BitacorasPage} />

        <Stack.Screen name="AddBitacora" component={AddBitacoraPage} />

        <Stack.Screen name="Zones">
          {() => (
            <PlaceholderPage
              title="Zonas"
              subtitle="Aquí podrás gestionar las zonas de cultivo."
              activeRoute="Zones"
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Notifications">
          {() => (
            <PlaceholderPage
              title="Notificaciones"
              subtitle="Aquí aparecerán tus alertas y recordatorios."
              activeRoute="Notifications"
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Profile" component={ProfilePage} />

        <Stack.Screen name="EditProfile" component={EditProfilePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}