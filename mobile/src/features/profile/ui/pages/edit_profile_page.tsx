import React, { useEffect, useState } from "react";
import {
  Alert,
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
import * as ImagePicker from "expo-image-picker";
import { useFonts } from "expo-font";
import { GravitasOne_400Regular } from "@expo-google-fonts/gravitas-one";
import { MaidenOrange_400Regular } from "@expo-google-fonts/maiden-orange";
import { AlfaSlabOne_400Regular } from "@expo-google-fonts/alfa-slab-one";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../../../core/navigation/app_navigator";
import { AppHeader } from "../../../../shared/ui/app_header";
import { BottomNavigationBar } from "../../../../shared/ui/bottom_navigation_bar";

type EditProfileRouteProp = RouteProp<RootStackParamList, "EditProfile">;

type EditProfileErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export function EditProfilePage() {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = height < 700;
  const horizontalPadding = width < 360 ? 24 : width < 400 ? 32 : 42;
  const headerHeight = Math.min(Math.max(height * 0.17, 105), 140);
  const cardPaddingTop = isSmallPhone ? 28 : 42;
  const titleFontSize = width < 360 ? 34 : 38;
  const avatarSize = width < 360 ? 82 : 92;

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const route = useRoute<EditProfileRouteProp>();

  const user = route.params.user;

  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(user.imageUri ?? null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<EditProfileErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [fontsLoaded] = useFonts({
    GravitasOne_400Regular,
    MaidenOrange_400Regular,
    AlfaSlabOne_400Regular,
  });

  useEffect(() => {
    setFullName(user.fullName);
    setEmail(user.email);
    setImageUri(user.imageUri ?? null);
  }, [user.email, user.fullName, user.imageUri]);

  const validateForm = (
    currentFullName: string,
    currentEmail: string,
    currentPassword: string,
    currentConfirmPassword: string
  ): EditProfileErrors => {
    const newErrors: EditProfileErrors = {};

    const cleanFullName = currentFullName.trim();
    const cleanEmail = currentEmail.trim();

    if (!cleanFullName) {
      newErrors.fullName = "El nombre completo es obligatorio";
    } else if (cleanFullName.length < 3) {
      newErrors.fullName = "El nombre debe tener mínimo 3 caracteres";
    }

    if (!cleanEmail) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(cleanEmail)) {
        newErrors.email = "Ingresa un correo electrónico válido";
      }
    }

    if (currentPassword.length > 0 && currentPassword.length < 6) {
      newErrors.password = "La contraseña debe tener mínimo 6 caracteres";
    }

    if (currentPassword.length > 0 && !currentConfirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (
      currentPassword.length > 0 &&
      currentPassword !== currentConfirmPassword
    ) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    return newErrors;
  };

  const handleFullNameChange = (value: string) => {
    const cleanValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    setFullName(cleanValue);

    if (hasSubmitted) {
      setErrors(validateForm(cleanValue, email, password, confirmPassword));
    }
  };

  const handleEmailChange = (value: string) => {
    const cleanValue = value.replace(/\s/g, "").toLowerCase();
    setEmail(cleanValue);

    if (hasSubmitted) {
      setErrors(validateForm(fullName, cleanValue, password, confirmPassword));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (hasSubmitted) {
      setErrors(validateForm(fullName, email, value, confirmPassword));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);

    if (hasSubmitted) {
      setErrors(validateForm(fullName, email, password, value));
    }
  };

  const handleSelectImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permiso requerido",
        "Debes permitir el acceso a tus fotos para cambiar la imagen."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    setHasSubmitted(true);

    const validationErrors = validateForm(
      fullName,
      email,
      password,
      confirmPassword
    );

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    Alert.alert(
      "Perfil actualizado",
      "La información del perfil se guardó correctamente."
    );

    navigation.navigate("Profile");
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
        <View style={styles.container}>
          <View>
            <AppHeader imageHeight={headerHeight} />

            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Profile")}
            >
              <Ionicons name="arrow-back" size={22} color={COLORS.green} />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.card,
              {
                paddingHorizontal: horizontalPadding,
                paddingTop: cardPaddingTop,
              },
            ]}
          >
            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
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
                Editar perfil
              </Text>

              <Text style={styles.subtitle}>
                Actualiza tu información personal
              </Text>

              <View style={styles.formCard}>
                <TouchableOpacity
                  style={styles.avatarWrapper}
                  activeOpacity={0.85}
                  onPress={handleSelectImage}
                >
                  <View
                    style={[
                      styles.avatarContainer,
                      {
                        width: avatarSize,
                        height: avatarSize,
                        borderRadius: avatarSize / 2,
                      },
                    ]}
                  >
                    {imageUri ? (
                      <Image
                        source={{ uri: imageUri }}
                        style={[
                          styles.avatarImage,
                          {
                            width: avatarSize,
                            height: avatarSize,
                            borderRadius: avatarSize / 2,
                          },
                        ]}
                        resizeMode="cover"
                      />
                    ) : (
                      <Ionicons
                        name="person-outline"
                        size={avatarSize * 0.55}
                        color={COLORS.green}
                      />
                    )}
                  </View>

                  <View style={styles.cameraBadge}>
                    <Ionicons name="camera" size={12} color={COLORS.pink} />
                  </View>
                </TouchableOpacity>

                <View
                  style={[
                    styles.inputContainer,
                    errors.fullName ? styles.inputError : null,
                  ]}
                >
                  <Ionicons name="person-outline" size={18} color={COLORS.green} />

                  <TextInput
                    style={styles.input}
                    placeholder="Nombre completo"
                    placeholderTextColor={COLORS.gray}
                    value={fullName}
                    onChangeText={handleFullNameChange}
                    autoCapitalize="words"
                    maxLength={60}
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
                  />

                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => setShowPassword(!showPassword)}
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
                  />

                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    <Ionicons
                      name={
                        showConfirmPassword
                          ? "eye-outline"
                          : "eye-off-outline"
                      }
                      size={18}
                      color={COLORS.green}
                    />
                  </TouchableOpacity>
                </View>

                {errors.confirmPassword ? (
                  <Text style={styles.errorText}>
                    {errors.confirmPassword}
                  </Text>
                ) : null}
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                activeOpacity={0.85}
                onPress={handleSave}
              >
                <Ionicons
                  name="save-outline"
                  size={15}
                  color={COLORS.background}
                />

                <Text style={styles.saveButtonText}>Guardar información</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <BottomNavigationBar activeRoute="Profile" />
        </View>
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
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.background,
    overflow: "hidden",
  },
  backButton: {
    position: "absolute",
    top: 12,
    left: 18,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  card: {
    flex: 1,
    marginTop: -28,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 90,
  },
  title: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.green,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 15,
    lineHeight: 18,
    color: COLORS.gray,
    marginBottom: 28,
  },
  formCard: {
    width: "100%",
    borderWidth: 1.4,
    borderColor: COLORS.green,
    borderRadius: 14,
    padding: 22,
    backgroundColor: COLORS.background,
    marginBottom: 30,
  },
  avatarWrapper: {
    alignSelf: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    backgroundColor: "#D9D9D9",
  },
  cameraBadge: {
    position: "absolute",
    right: 2,
    bottom: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.pink,
  },
  inputContainer: {
    width: "100%",
    minHeight: 42,
    borderWidth: 1,
    borderColor: COLORS.green,
    borderRadius: 9,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: COLORS.background,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 14,
    lineHeight: 18,
    color: COLORS.black,
    paddingVertical: 0,
  },
  errorText: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.error,
    fontSize: 13,
    lineHeight: 16,
    marginTop: -4,
    marginBottom: 10,
    marginLeft: 4,
  },
  saveButton: {
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: COLORS.pink,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 22,
  },
  saveButtonText: {
    fontFamily: "AlfaSlabOne_400Regular",
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.background,
    marginLeft: 6,
  },
});