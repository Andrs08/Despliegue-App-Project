import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { GravitasOne_400Regular } from "@expo-google-fonts/gravitas-one";
import { MaidenOrange_400Regular } from "@expo-google-fonts/maiden-orange";
import { AlfaSlabOne_400Regular } from "@expo-google-fonts/alfa-slab-one";
import { useNavigation, useRoute } from "@react-navigation/native";
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../../../core/navigation/app_navigator";
import { AppHeader } from "../../../../shared/ui/app_header";

type ResetPasswordRouteProp =
  NativeStackScreenProps<RootStackParamList, "ResetPassword">["route"];

type ResetPasswordErrors = {
  password?: string;
  confirmPassword?: string;
};

export function ResetPasswordPage() {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = height < 700;
  const horizontalPadding = width < 360 ? 24 : width < 400 ? 32 : 44;
  const headerHeight = Math.min(Math.max(height * 0.17, 105), 140);
  const titleFontSize = width < 360 ? 34 : 38;
  const cardPaddingTop = isSmallPhone ? 38 : 56;
  const emailMarginBottom = isSmallPhone ? 24 : 32;
  const buttonMarginBottom = isSmallPhone ? 26 : 34;

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const route = useRoute<ResetPasswordRouteProp>();

  const { email } = route.params;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<ResetPasswordErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [fontsLoaded] = useFonts({
    GravitasOne_400Regular,
    MaidenOrange_400Regular,
    AlfaSlabOne_400Regular,
  });

  const validateForm = (
    currentPassword: string,
    currentConfirmPassword: string
  ): ResetPasswordErrors => {
    const newErrors: ResetPasswordErrors = {};

    if (!currentPassword) {
      newErrors.password = "La nueva contraseña es obligatoria";
    } else if (currentPassword.length < 6) {
      newErrors.password = "La contraseña debe tener mínimo 6 caracteres";
    }

    if (!currentConfirmPassword) {
      newErrors.confirmPassword = "Debes confirmar la contraseña";
    } else if (currentPassword !== currentConfirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    return newErrors;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (hasSubmitted) {
      setErrors(validateForm(value, confirmPassword));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);

    if (hasSubmitted) {
      setErrors(validateForm(password, value));
    }
  };

  const handleResetPassword = () => {
    setHasSubmitted(true);

    const validationErrors = validateForm(password, confirmPassword);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <AppHeader imageHeight={headerHeight} />

            <View
              style={[
                styles.card,
                {
                  paddingHorizontal: horizontalPadding,
                  paddingTop: cardPaddingTop,
                },
              ]}
            >
              <Text
                style={[
                  styles.title,
                  {
                    fontSize: titleFontSize,
                    lineHeight: titleFontSize + 4,
                  },
                ]}
              >
                Nueva contraseña
              </Text>

              <Text style={styles.subtitle}>
                Crea una nueva contraseña para recuperar el acceso a tu cuenta.
              </Text>

              <Text
                style={[
                  styles.emailText,
                  {
                    marginBottom: emailMarginBottom,
                  },
                ]}
              >
                {email}
              </Text>

              <View style={styles.form}>
                <View
                  style={[
                    styles.inputContainer,
                    errors.password ? styles.inputError : null,
                  ]}
                >
                  <Ionicons
                    name="lock-closed"
                    size={18}
                    color={COLORS.green}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Nueva contraseña"
                    placeholderTextColor={COLORS.gray}
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={40}
                  />
                </View>

                {errors.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}

                <View
                  style={[
                    styles.inputContainer,
                    errors.confirmPassword ? styles.inputError : null,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color={COLORS.green}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Confirmar contraseña"
                    placeholderTextColor={COLORS.gray}
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={40}
                  />
                </View>

                {errors.confirmPassword ? (
                  <Text style={styles.errorText}>
                    {errors.confirmPassword}
                  </Text>
                ) : null}

                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    {
                      marginBottom: buttonMarginBottom,
                    },
                  ]}
                  activeOpacity={0.8}
                  onPress={handleResetPassword}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={15}
                    color={COLORS.background}
                  />

                  <Text style={styles.sendButtonText}>
                    Actualizar contraseña
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.backButton}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate("Login")}
                >
                  <Text style={styles.backButtonText}>
                    Volver al inicio de sesión
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const COLORS = {
  green: "#5D7B3D",
  background: "#FFFFF1",
  gray: "#959595",
  black: "#000000",
  pink: "#E4568B",
  darkBackground: "#202020",
  error: "#C94C4C",
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.background,
    overflow: "hidden",
  },
  card: {
    flexGrow: 1,
    marginTop: -28,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingBottom: 50,
    alignItems: "center",
  },
  title: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.green,
    textAlign: "center",
    marginBottom: 22,
  },
  subtitle: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 16,
    lineHeight: 19,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 14,
  },
  emailText: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 17,
    lineHeight: 21,
    color: COLORS.pink,
    textAlign: "center",
  },
  form: {
    width: "100%",
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
    minHeight: 52,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(149, 149, 149, 0.12)",
    marginBottom: 8,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    color: COLORS.black,
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 17,
    lineHeight: 21,
  },
  errorText: {
    alignSelf: "flex-start",
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.error,
    fontSize: 13,
    lineHeight: 16,
    marginBottom: 16,
    marginLeft: 4,
  },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.pink,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 22,
    marginTop: 20,
  },
  sendButtonText: {
    fontFamily: "AlfaSlabOne_400Regular",
    color: COLORS.background,
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 6,
  },
  backButton: {
    borderWidth: 1.5,
    borderColor: COLORS.pink,
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 22,
  },
  backButtonText: {
    fontFamily: "AlfaSlabOne_400Regular",
    color: COLORS.pink,
    fontSize: 12,
    lineHeight: 17,
  },
});