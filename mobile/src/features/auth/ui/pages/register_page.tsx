import React from "react";
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
import { AuthRepository } from "../../infrastructure/persistence/auth.repository";
import { RegisterUseCase } from "../../application/use-cases/register.use-case";
import { RootStackParamList } from "@/src/core/navigation/app_navigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import { useRegisterViewModel } from "../viewmodels/register_viewmodel";
import { LoginUseCase } from "../../application/use-cases/login.use-case";

export function RegisterPage() {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = height < 700;
  const horizontalPadding = width < 360 ? 24 : width < 400 ? 32 : 46;
  const headerHeight = isSmallPhone
    ? Math.min(height * 0.25, 190)
    : Math.min(height * 0.29, 250);
  const cardPaddingTop = isSmallPhone ? 34 : 50;
  const titleFontSize = width < 360 ? 36 : 40;
  const subtitleMarginBottom = isSmallPhone ? 28 : 42;

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    isLoading,
    apiError,
    fullName,
    email,
    password,
    confirmPassword,
    errors,
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    handleFullNameChange,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleRegister,
  } = useRegisterViewModel(() => {
    navigation.navigate("Dashboard");
  });

  const [fontsLoaded] = useFonts({
    GravitasOne_400Regular,
    MaidenOrange_400Regular,
    AlfaSlabOne_400Regular,
  });

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
              <Text
                style={[
                  styles.title,
                  {
                    fontSize: titleFontSize,
                    lineHeight: titleFontSize + 4,
                  },
                ]}
              >
                Regístrate
              </Text>

              <Text
                style={[
                  styles.subtitle,
                  {
                    marginBottom: subtitleMarginBottom,
                  },
                ]}
              >
                Crea una cuenta para comenzar{"\n"}y monitorear tus cultivos
              </Text>

              <View style={styles.form}>
                <View
                  style={[
                    styles.inputContainer,
                    errors.fullName ? styles.inputError : null,
                  ]}
                >
                  <Ionicons name="person" size={18} color={COLORS.green} />

                  <TextInput
                    style={styles.input}
                    placeholder="Nombre completo"
                    placeholderTextColor={COLORS.gray}
                    value={fullName}
                    onChangeText={handleFullNameChange}
                    autoCapitalize="words"
                    maxLength={60}
                    editable={!isLoading}
                  />
                </View>

                {errors.fullName ? (
                  <Text style={styles.errorText}>{errors.fullName}</Text>
                ) : null}

                <View
                  style={[
                    styles.inputContainer,
                    errors.email ? styles.inputError : null,
                  ]}
                >
                  <Ionicons name="mail" size={18} color={COLORS.green} />

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
                    editable={!isLoading}
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
                    size={18}
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
                    editable={!isLoading}
                  />

                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={18}
                      color={COLORS.green}
                    />
                  </TouchableOpacity>
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
                    secureTextEntry={!showConfirmPassword}
                    maxLength={30}
                    editable={!isLoading}
                  />

                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-outline" : "eye-off-outline"
                      }
                      size={18}
                      color={COLORS.green}
                    />
                  </TouchableOpacity>
                </View>

                {errors.confirmPassword ? (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                ) : null}

                {apiError ? (
                  <Text
                    style={[
                      styles.errorText,
                      { textAlign: "center", marginBottom: 16 },
                    ]}
                  >
                    {apiError}
                  </Text>
                ) : null}
                <TouchableOpacity
                  style={[
                    styles.registerButton,
                    {
                      marginTop: isSmallPhone ? 12 : 18,
                      opacity: isLoading ? 0.6 : 1,
                    },
                  ]}
                  activeOpacity={0.8}
                  onPress={handleRegister}
                  disabled={isLoading}
                >
                  <Text style={styles.registerButtonText}>Crear cuenta</Text>
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate("Login")}
                  >
                    <Text style={styles.loginLink}>Inicia sesión</Text>
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
    marginTop: -42,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingBottom: 44,
    alignItems: "center",
  },
  title: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.green,
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 15,
    lineHeight: 17,
    color: COLORS.gray,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    minHeight: 49,
    backgroundColor: COLORS.background,
    borderRadius: 9,
    paddingHorizontal: 13,
    paddingVertical: 9,
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
    fontSize: 17,
    lineHeight: 21,
  },
  errorText: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.error,
    fontSize: 13,
    lineHeight: 16,
    marginBottom: 12,
    marginLeft: 4,
  },
  registerButton: {
    alignSelf: "center",
    backgroundColor: COLORS.green,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 22,
    marginBottom: 20,
  },
  registerButtonText: {
    fontFamily: "AlfaSlabOne_400Regular",
    color: COLORS.background,
    fontSize: 13,
    lineHeight: 18,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.gray,
    fontSize: 13,
    lineHeight: 18,
  },
  loginLink: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.green,
    fontSize: 13,
    lineHeight: 18,
  },
});
