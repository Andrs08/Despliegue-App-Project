import React, { useState } from "react";
import {
  Image,
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
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../../../core/navigation/app_navigator";

type LoginErrors = {
  email?: string;
  password?: string;
};

export function LoginPage() {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = height < 700;
  const horizontalPadding = width < 360 ? 24 : width < 400 ? 30 : 34;
  const headerHeight = isSmallPhone
    ? Math.min(height * 0.29, 215)
    : Math.min(height * 0.32, 275);

  const logoFontSize = width < 360 ? 42 : 48;
  const titleFontSize = width < 360 ? 36 : 40;
  const subtitleMarginBottom = isSmallPhone ? 24 : 34;
  const forgotMarginBottom = isSmallPhone ? 26 : 36;
  const cardPaddingTop = isSmallPhone ? 30 : 38;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<LoginErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [fontsLoaded] = useFonts({
    GravitasOne_400Regular,
    MaidenOrange_400Regular,
    AlfaSlabOne_400Regular,
  });

  const validateForm = (
    currentEmail: string,
    currentPassword: string
  ): LoginErrors => {
    const newErrors: LoginErrors = {};
    const cleanEmail = currentEmail.trim();

    if (!cleanEmail) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(cleanEmail)) {
        newErrors.email = "Ingresa un correo electrónico válido";
      }
    }

    if (!currentPassword.trim()) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (currentPassword.length < 6) {
      newErrors.password = "La contraseña debe tener mínimo 6 caracteres";
    }

    return newErrors;
  };

  const handleEmailChange = (value: string) => {
    const cleanValue = value.replace(/\s/g, "").toLowerCase();
    setEmail(cleanValue);

    if (hasSubmitted) {
      setErrors(validateForm(cleanValue, password));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (hasSubmitted) {
      setErrors(validateForm(email, value));
    }
  };

  const handleLogin = () => {
    setHasSubmitted(true);

    const validationErrors = validateForm(email, password);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{ name: "Dashboard" }],
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
            <Image
              source={require("../../../../../assets/images/fondo.png")}
              style={[
                styles.headerImage,
                {
                  height: headerHeight,
                },
              ]}
              resizeMode="cover"
            />

            <View
              style={[
                styles.card,
                {
                  paddingHorizontal: horizontalPadding,
                  paddingTop: cardPaddingTop,
                },
              ]}
            >
              <View style={styles.logoContainer}>
                <Text
                  style={[
                    styles.logoGreen,
                    {
                      fontSize: logoFontSize,
                      lineHeight: logoFontSize + 10,
                    },
                  ]}
                >
                  Bana
                </Text>

                <Text
                  style={[
                    styles.logoYellow,
                    {
                      fontSize: logoFontSize,
                      lineHeight: logoFontSize + 10,
                    },
                  ]}
                >
                  Eye
                </Text>
              </View>

              <Text
                style={[
                  styles.title,
                  {
                    fontSize: titleFontSize,
                    lineHeight: titleFontSize + 4,
                  },
                ]}
              >
                Bienvenido
              </Text>

              <Text
                style={[
                  styles.subtitle,
                  {
                    marginBottom: subtitleMarginBottom,
                  },
                ]}
              >
                inicia sesión para continuar
              </Text>

              <View style={styles.form}>
                <View
                  style={[
                    styles.inputContainer,
                    errors.email ? styles.inputError : null,
                  ]}
                >
                  <Ionicons name="mail" size={19} color={COLORS.green} />

                  <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor={COLORS.gray}
                    value={email}
                    onChangeText={handleEmailChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={80}
                  />
                </View>

                {errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}

                <View
                  style={[
                    styles.inputContainer,
                    errors.password ? styles.inputError : null,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={19}
                    color={COLORS.green}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor={COLORS.gray}
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry={!showPassword}
                    maxLength={30}
                  />

                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={19}
                      color={COLORS.green}
                    />
                  </TouchableOpacity>
                </View>

                {errors.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  <Text
                    style={[
                      styles.forgotText,
                      {
                        marginBottom: forgotMarginBottom,
                      },
                    ]}
                  >
                    ¿Olvidaste tu contraseña?
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.loginButton}
                  activeOpacity={0.8}
                  onPress={handleLogin}
                >
                  <Text style={styles.loginButtonText}>Iniciar sesión</Text>
                </TouchableOpacity>

                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>¿No tienes cuenta? </Text>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate("Register")}
                  >
                    <Text style={styles.registerLink}>Regístrate</Text>
                  </TouchableOpacity>
                </View>
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
  yellow: "#F6C94D",
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
  headerImage: {
    width: "100%",
  },
  card: {
    flexGrow: 1,
    marginTop: -45,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingBottom: 45,
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  logoGreen: {
    fontFamily: "GravitasOne_400Regular",
    letterSpacing: -0.96,
    color: COLORS.green,
  },
  logoYellow: {
    fontFamily: "GravitasOne_400Regular",
    letterSpacing: -0.96,
    color: COLORS.yellow,
  },
  title: {
    fontFamily: "MaidenOrange_400Regular",
    letterSpacing: 0.5,
    color: COLORS.green,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 18,
    lineHeight: 22,
    color: COLORS.gray,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    minHeight: 52,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(149, 149, 149, 0.12)",
  },
  inputError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    color: COLORS.black,
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 18,
    lineHeight: 22,
  },
  errorText: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.error,
    fontSize: 14,
    lineHeight: 17,
    marginBottom: 13,
    marginLeft: 4,
  },
  forgotText: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.gray,
    fontSize: 14,
    lineHeight: 18,
    marginTop: 4,
  },
  loginButton: {
    alignSelf: "center",
    backgroundColor: COLORS.green,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 22,
    marginBottom: 18,
  },
  loginButtonText: {
    fontFamily: "AlfaSlabOne_400Regular",
    color: COLORS.background,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.gray,
    fontSize: 14,
    lineHeight: 18,
  },
  registerLink: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.green,
    fontSize: 14,
    lineHeight: 18,
  },
});