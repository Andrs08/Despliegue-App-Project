import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../core/navigation/app_navigator";

export type LoggedRouteName =
  | "Dashboard"
  | "Bitacoras"
  | "Zones"
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
    route: "Zones",
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

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const isSmallPhone = height < 700;

  const barHeight = isSmallPhone ? 54 : 60;
  const iconSize = width < 360 ? 24 : width < 400 ? 26 : 28;
  const buttonSize = width < 360 ? 42 : width < 400 ? 46 : 48;
  const horizontalPadding = width < 360 ? 6 : 10;

  return (
    <View
      style={[
        styles.container,
        {
          height: barHeight,
          paddingHorizontal: horizontalPadding,
        },
      ]}
    >
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
            onPress={() => navigation.navigate(item.route)}
          >
            <Ionicons
              name={item.icon}
              size={iconSize}
              color={isActive ? COLORS.green : COLORS.green}
            />
          </TouchableOpacity>
        );
      })}
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
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});