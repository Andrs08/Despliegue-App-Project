import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
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
import { AppHeader } from "../../../../shared/ui/app_header";
import { BottomNavigationBar } from "../../../../shared/ui/bottom_navigation_bar";

const CURRENT_USER = {
  fullName: "Maria Ordóñez",
  email: "maria.camilaor@gmail.com",
  imageUri: null as string | null,
};

export function ProfilePage() {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = height < 700;
  const horizontalPadding = width < 360 ? 24 : width < 400 ? 32 : 42;
  const headerHeight = Math.min(Math.max(height * 0.17, 105), 140);
  const cardPaddingTop = isSmallPhone ? 28 : 42;
  const titleFontSize = width < 360 ? 34 : 38;
  const avatarSize = width < 360 ? 76 : 86;

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [fontsLoaded] = useFonts({
    GravitasOne_400Regular,
    MaidenOrange_400Regular,
    AlfaSlabOne_400Regular,
  });

  const handleLogout = () => {
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
            <ScrollView
              contentContainerStyle={styles.content}
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
                Mi perfil
              </Text>

              <Text style={styles.subtitle}>Gestiona tu cuenta</Text>

              <View style={styles.profileCard}>
                <View style={styles.userRow}>
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
                    {CURRENT_USER.imageUri ? (
                      <Image
                        source={{ uri: CURRENT_USER.imageUri }}
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

                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{CURRENT_USER.fullName}</Text>
                    <Text style={styles.userEmail}>{CURRENT_USER.email}</Text>
                  </View>
                </View>

                <View style={styles.separator} />

                <TouchableOpacity
                  style={styles.editButton}
                  activeOpacity={0.85}
                  onPress={() =>
                    navigation.navigate("EditProfile", {
                      user: CURRENT_USER,
                    })
                  }
                >
                  <Ionicons name="create-outline" size={16} color={COLORS.green} />

                  <Text style={styles.editButtonText}>Editar perfil</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.logoutButton}
                activeOpacity={0.85}
                onPress={handleLogout}
              >
                <Ionicons
                  name="log-out-outline"
                  size={15}
                  color={COLORS.background}
                />

                <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
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
  pink: "#E4568B",
  lightGreen: "#BDE79A",
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
  profileCard: {
    width: "100%",
    borderWidth: 1.4,
    borderColor: COLORS.green,
    borderRadius: 14,
    padding: 22,
    backgroundColor: COLORS.background,
    marginBottom: 36,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  avatarImage: {
    backgroundColor: "#D9D9D9",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 24,
    lineHeight: 28,
    color: COLORS.green,
  },
  userEmail: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 13,
    lineHeight: 16,
    color: COLORS.gray,
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: COLORS.green,
    opacity: 0.35,
    marginVertical: 18,
  },
  editButton: {
    width: "100%",
    minHeight: 40,
    borderRadius: 9,
    backgroundColor: COLORS.lightGreen,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  editButtonText: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 17,
    lineHeight: 21,
    color: COLORS.green,
    marginLeft: 8,
  },
  logoutButton: {
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: COLORS.pink,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 22,
  },
  logoutButtonText: {
    fontFamily: "AlfaSlabOne_400Regular",
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.background,
    marginLeft: 6,
  },
});