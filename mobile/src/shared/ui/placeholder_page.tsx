import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useFonts } from "expo-font";
import { GravitasOne_400Regular } from "@expo-google-fonts/gravitas-one";
import { MaidenOrange_400Regular } from "@expo-google-fonts/maiden-orange";
import { AlfaSlabOne_400Regular } from "@expo-google-fonts/alfa-slab-one";

import { AppHeader } from "./app_header";
import {
  BottomNavigationBar,
  type LoggedRouteName,
} from "./bottom_navigation_bar";

type PlaceholderPageProps = {
  title: string;
  subtitle: string;
  activeRoute: LoggedRouteName;
};

export function PlaceholderPage({
  title,
  subtitle,
  activeRoute,
}: PlaceholderPageProps) {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = height < 700;
  const horizontalPadding = width < 360 ? 24 : width < 400 ? 32 : 42;
  const headerHeight = Math.min(Math.max(height * 0.17, 105), 140);
  const cardPaddingTop = isSmallPhone ? 32 : 42;
  const titleFontSize = width < 360 ? 36 : 40;
  const subtitleFontSize = width < 360 ? 15 : 16;

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
        <View style={styles.screenWrapper}>
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
                      lineHeight: titleFontSize + 3,
                    },
                  ]}
                >
                  {title}
                </Text>

                <Text
                  style={[
                    styles.subtitle,
                    {
                      fontSize: subtitleFontSize,
                      lineHeight: subtitleFontSize + 3,
                    },
                  ]}
                >
                  {subtitle}
                </Text>
              </ScrollView>
            </View>

            <BottomNavigationBar activeRoute={activeRoute} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const COLORS = {
  green: "#5D7B3D",
  background: "#FFFFF1",
  gray: "#959595",
  darkBackground: "#202020",
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
  screenWrapper: {
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
    paddingBottom: 24,
  },
  title: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.green,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.gray,
  },
});