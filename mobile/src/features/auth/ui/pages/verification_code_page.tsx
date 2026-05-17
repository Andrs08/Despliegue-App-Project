import React, { useRef, useState } from "react";
import {
  Alert,
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
import { useFonts } from "expo-font";
import { GravitasOne_400Regular } from "@expo-google-fonts/gravitas-one";
import { MaidenOrange_400Regular } from "@expo-google-fonts/maiden-orange";
import { AlfaSlabOne_400Regular } from "@expo-google-fonts/alfa-slab-one";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../../../core/navigation/app_navigator";
import { AppHeader } from "../../../../shared/ui/app_header";

type VerificationCodeRouteProp = RouteProp<
  RootStackParamList,
  "VerificationCode"
>;

export function VerificationCodePage() {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = height < 700;
  const horizontalPadding = width < 360 ? 24 : width < 400 ? 32 : 44;
  const headerHeight = Math.min(Math.max(height * 0.17, 105), 140);
  const titleFontSize = width < 360 ? 34 : 39;
  const cardPaddingTop = isSmallPhone ? 38 : 58;
  const subtitleMarginBottom = isSmallPhone ? 30 : 44;
  const codeInputWidth = width < 360 ? 34 : width < 400 ? 38 : 42;
  const codeInputHeight = isSmallPhone ? 42 : 45;
  const verifyButtonMarginTop = isSmallPhone ? 18 : 22;
  const verifyButtonMarginBottom = isSmallPhone ? 22 : 28;

  const route = useRoute<VerificationCodeRouteProp>();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const email = route.params?.email ?? "tu correo electrónico";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

  const inputRefs = useRef<Array<TextInput | null>>([]);

  const [fontsLoaded] = useFonts({
    GravitasOne_400Regular,
    MaidenOrange_400Regular,
    AlfaSlabOne_400Regular,
  });

  const maskEmail = (currentEmail: string) => {
    const [name, domain] = currentEmail.split("@");

    if (!name || !domain) {
      return currentEmail;
    }

    const visiblePart = name.slice(0, 2);
    return `${visiblePart}****@${domain}`;
  };

  const handleCodeChange = (value: string, index: number) => {
    const cleanValue = value.replace(/[^0-9]/g, "").slice(0, 1);

    const newCode = [...code];
    newCode[index] = cleanValue;
    setCode(newCode);

    if (error) {
      setError("");
    }

    if (cleanValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = () => {
    const finalCode = code.join("");

    if (finalCode.length < 6) {
      setError("Ingresa el código de 6 dígitos");
      return;
    }

    navigation.navigate("ResetPassword", {
      email,
    });
  };

  const handleResendCode = () => {
    Alert.alert(
      "Código reenviado",
      "Te enviamos un nuevo código de verificación."
    );
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
                Verifica tu correo
              </Text>

              <Text
                style={[
                  styles.subtitle,
                  {
                    marginBottom: subtitleMarginBottom,
                  },
                ]}
              >
                Hemos enviado un código de verificación a{"\n"}
                <Text style={styles.emailText}>{maskEmail(email)}</Text>
              </Text>

              <View style={styles.codeBox}>
                <Text style={styles.codeLabel}>Código de verificación</Text>

                <View style={styles.codeInputsContainer}>
                  {code.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => {
                        inputRefs.current[index] = ref;
                      }}
                      style={[
                        styles.codeInput,
                        {
                          width: codeInputWidth,
                          height: codeInputHeight,
                        },
                        error ? styles.codeInputError : null,
                      ]}
                      value={digit}
                      onChangeText={(value) => handleCodeChange(value, index)}
                      onKeyPress={({ nativeEvent }) =>
                        handleKeyPress(nativeEvent.key, index)
                      }
                      keyboardType="number-pad"
                      maxLength={1}
                      textAlign="center"
                    />
                  ))}
                </View>
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity
                style={[
                  styles.verifyButton,
                  {
                    marginTop: verifyButtonMarginTop,
                    marginBottom: verifyButtonMarginBottom,
                  },
                ]}
                activeOpacity={0.8}
                onPress={handleVerifyCode}
              >
                <Text style={styles.verifyButtonText}>Verificar código</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resendButton}
                activeOpacity={0.8}
                onPress={handleResendCode}
              >
                <Text style={styles.resendButtonText}>Reenviar código</Text>
              </TouchableOpacity>
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
    marginBottom: 28,
  },
  subtitle: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 16,
    lineHeight: 19,
    color: COLORS.gray,
    textAlign: "center",
  },
  emailText: {
    color: COLORS.green,
  },
  codeBox: {
    width: "100%",
    marginBottom: 12,
  },
  codeLabel: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.green,
    fontSize: 13,
    lineHeight: 16,
    marginBottom: 8,
  },
  codeInputsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  codeInput: {
    borderWidth: 1.4,
    borderColor: COLORS.green,
    borderRadius: 8,
    color: COLORS.black,
    fontFamily: "AlfaSlabOne_400Regular",
    fontSize: 17,
    backgroundColor: COLORS.background,
  },
  codeInputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    alignSelf: "flex-start",
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.error,
    fontSize: 13,
    lineHeight: 16,
    marginTop: 4,
    marginLeft: 4,
  },
  verifyButton: {
    backgroundColor: COLORS.pink,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 22,
  },
  verifyButtonText: {
    fontFamily: "AlfaSlabOne_400Regular",
    color: COLORS.background,
    fontSize: 13,
    lineHeight: 18,
  },
  resendButton: {
    borderWidth: 1.5,
    borderColor: COLORS.pink,
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 22,
  },
  resendButtonText: {
    fontFamily: "AlfaSlabOne_400Regular",
    color: COLORS.pink,
    fontSize: 12,
    lineHeight: 17,
  },
});