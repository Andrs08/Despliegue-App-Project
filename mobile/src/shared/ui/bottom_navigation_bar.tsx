import React from "react";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { RootStackParamList } from "../../core/navigation/app_navigator";

export type LoggedRouteName =
  | "Dashboard"
  | "Bitacoras"
  | "Lots"
  | "Notifications"
  | "Profile";

type BottomNavigationBarProps = {
  activeRoute: LoggedRouteName;
};

type NavigationItem = {
  route: LoggedRouteName;
  icon: keyof typeof Ionicons.glyphMap;
};

const items: NavigationItem[] = [
  {
    route: "Dashboard",
    icon: "home-outline",
  },
  {
    route: "Bitacoras",
    icon: "document-text-outline",
  },
  {
    route: "Lots",
    icon: "location-outline",
  },
  {
    route: "Notifications",
    icon: "notifications-outline",
  },
  {
    route: "Profile",
    icon: "person-outline",
  },
];

export function BottomNavigationBar({ activeRoute }: BottomNavigationBarProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const isSmallPhone = height < 700;

  const baseBarHeight = isSmallPhone ? 54 : 60;
  const iconSize = width < 360 ? 24 : width < 400 ? 26 : 28;
  const buttonSize = width < 360 ? 42 : width < 400 ? 46 : 48;
  const horizontalPadding = width < 360 ? 6 : 10;

  const bottomSafePadding =
    Platform.OS === "android" ? Math.max(insets.bottom, 12) : insets.bottom;

  return (
    <View
      style={[
        styles.container,
        {
          height: baseBarHeight + bottomSafePadding,
          paddingHorizontal: horizontalPadding,
          paddingBottom: bottomSafePadding,
        },
      ]}
    >
      <View style={styles.itemsContainer}>
        {items.map((item) => {
          const isActive = item.route === activeRoute;

          return (
            <TouchableOpacity
              key={item.route}
              style={[
                styles.iconButton,
                {
                  width: buttonSize,
                  height: buttonSize,
                },
              ]}
              activeOpacity={0.7}
              onPress={() => {
                if (!isActive) {
                  navigation.navigate(item.route);
                }
              }}
            >
              <Ionicons name={item.icon} size={iconSize} color={COLORS.green} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const COLORS = {
  green: "#5D7B3D",
  background: "#FFFFF1",
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: "rgba(93, 123, 61, 0.18)",
  },
  itemsContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});