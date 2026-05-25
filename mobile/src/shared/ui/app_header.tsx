import React from "react";
import { Image, StyleSheet, Text, useWindowDimensions, View } from "react-native";

type AppHeaderProps = {
  imageHeight?: number;
};

export function AppHeader({ imageHeight }: AppHeaderProps) {
  const { width, height } = useWindowDimensions();

  const logoHeaderHeight = Math.min(Math.max(height * 0.085, 62), 82);
  const logoFontSize = width < 360 ? 27 : width < 400 ? 30 : 32;
  const logoLineHeight = logoFontSize + 8;

  const responsiveImageHeight =
    imageHeight ?? Math.min(Math.max(height * 0.17, 105), 140);

  return (
    <>
      <View
        style={[
          styles.logoHeader,
          {
            height: logoHeaderHeight,
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <Text
            style={[
              styles.logoGreen,
              {
                fontSize: logoFontSize,
                lineHeight: logoLineHeight,
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
                lineHeight: logoLineHeight,
              },
            ]}
          >
            Eye
          </Text>
        </View>
      </View>

      <Image
        source={require("../../../assets/images/fondo2.png")}
        style={[
          styles.headerImage,
          {
            height: responsiveImageHeight,
          },
        ]}
        resizeMode="cover"
      />
    </>
  );
}

const COLORS = {
  green: "#5D7B3D",
  background: "#FFFFF1",
  yellow: "#F6C94D",
};

const styles = StyleSheet.create({
  logoHeader: {
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoGreen: {
    fontFamily: "GravitasOne_400Regular",
    color: COLORS.green,
    letterSpacing: -0.5,
  },
  logoYellow: {
    fontFamily: "GravitasOne_400Regular",
    color: COLORS.yellow,
    letterSpacing: -0.5,
  },
  headerImage: {
    width: "100%",
  },
});