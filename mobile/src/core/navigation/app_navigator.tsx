import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { LoginPage } from "../../features/auth/ui/pages/login_page";
import { RegisterPage } from "../../features/auth/ui/pages/register_page";
import { ForgotPasswordPage } from "../../features/auth/ui/pages/forgot_password_page";
import { VerificationCodePage } from "../../features/auth/ui/pages/verification_code_page";
import { ResetPasswordPage } from "../../features/auth/ui/pages/reset_password_page";

import { DashboardPage } from "../../features/dashboard/ui/pages/dashboard_page";

import { BitacorasPage } from "../../features/bitacora/ui/pages/bitacoras_page";
import { AddBitacoraPage } from "../../features/bitacora/ui/pages/add_bitacora_page";

import { LotesPage } from "../../features/lote/ui/pages/lotes_page";
import { LoteFormPage } from "../../features/lote/ui/pages/lote_form_page";
import { DetailLotePage } from "../../features/lote/ui/pages/detail_lote_page";
import { RegisterLoteDataPage } from "../../features/lote/ui/pages/register_lote_data_page";

import { AlertsPage } from "../../features/alerts/ui/pages/alerts_page";
import { DetailAlertPage } from "../../features/alerts/ui/pages/detail_alert_page";

import { ProfilePage } from "../../features/profile/ui/pages/profile_page";
import { EditProfilePage } from "../../features/profile/ui/pages/edit_profile_page";

export type BitacoraRouteItem = {
  id: string;
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

export type EtapaLote =
  | "preparacion_suelo"
  | "siembra"
  | "desarrollo_vegetativo"
  | "floracion"
  | "fructificacion"
  | "cosecha";

export type EstadoLote = "Sano" | "Observación" | "Riesgo";

export type LoteRouteItem = {
  id: string;
  nombre: string;
  hectareas: number;
  temperaturaMinima: number;
  temperaturaMaxima: number;
  etapa: EtapaLote;
  fechaInicio: string;
  numeroPlantas: number;
  estado: EstadoLote;
  produccionEstimada: number;
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

  Lots: undefined;

  LoteForm:
    | {
        mode: "create";
      }
    | {
        mode: "edit";
        loteId: string;
      };

  DetailLote: {
    loteId: string;
  };

  RegisterLoteData: {
    loteId: string;
  };

  Notifications: undefined;

  DetailAlert: {
    lotId: number;
  };

  Profile: undefined;

  EditProfile: {
    user: UserProfileRouteItem;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <SafeAreaProvider>
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

          <Stack.Screen name="Lots" component={LotesPage} />

          <Stack.Screen name="LoteForm" component={LoteFormPage} />

          <Stack.Screen name="DetailLote" component={DetailLotePage} />

          <Stack.Screen
            name="RegisterLoteData"
            component={RegisterLoteDataPage}
          />

          <Stack.Screen name="Notifications" component={AlertsPage} />

          <Stack.Screen name="DetailAlert" component={DetailAlertPage} />

          <Stack.Screen name="Profile" component={ProfilePage} />

          <Stack.Screen name="EditProfile" component={EditProfilePage} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
