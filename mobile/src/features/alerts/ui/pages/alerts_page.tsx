import React from "react";
import {
  ActivityIndicator,
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
import { MaidenOrange_400Regular } from "@expo-google-fonts/maiden-orange";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../../../core/navigation/app_navigator";
import { AppHeader } from "../../../../shared/ui/app_header";
import { BottomNavigationBar } from "../../../../shared/ui/bottom_navigation_bar";
import {
  getAlertLotDotColor,
  useAlertsViewModel,
} from "../viewmodels/alerts_viewmodel";

const COLORS = {
  green: "#5D7B3D",
  background: "#FFFFF1",
  gray: "#959595",
  black: "#000000",
  pink: "#E4568B",
  yellow: "#F6C94D",
  blue: "#4A7DBA",
};

export function AlertsPage() {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = height < 700;
  const horizontalPadding = width < 360 ? 24 : width < 400 ? 32 : 42;
  const headerHeight = Math.min(Math.max(height * 0.17, 105), 140);
  const cardPaddingTop = isSmallPhone ? 28 : 40;
  const titleFontSize = width < 360 ? 34 : 38;

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    summaryCards,
    lots,
    searchText,
    isLoading,
    error,
    handleSearchChange,
    handleOpenDetail,
  } = useAlertsViewModel({
    onOpenDetail: (lotId) => {
      const lot = lots.find((l) => l.id === lotId);
      navigation.navigate("DetailAlert", {
        lotId,
        lotName: lot?.lotName ?? "",
      });
    },
  });

  const [fontsLoaded] = useFonts({
    MaidenOrange_400Regular,
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
              keyboardShouldPersistTaps="handled"
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
                Alertas
              </Text>

              <Text style={styles.subtitle}>
                Revisa novedades y recomendaciones para tu cultivo
              </Text>

              <View style={styles.summaryRow}>
                {summaryCards.map((cardItem) => (
                  <View
                    key={cardItem.key}
                    style={[
                      styles.summaryCard,
                      {
                        borderColor: cardItem.borderColor,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.summaryCount,
                        {
                          color: cardItem.color,
                        },
                      ]}
                    >
                      {cardItem.count}
                    </Text>

                    <Text
                      style={[
                        styles.summaryLabel,
                        {
                          color: cardItem.color,
                        },
                      ]}
                    >
                      {cardItem.label}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.searchContainer}>
                <Ionicons
                  name="search-outline"
                  size={18}
                  color={COLORS.black}
                />

                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar lote ..."
                  placeholderTextColor={COLORS.gray}
                  value={searchText}
                  onChangeText={handleSearchChange}
                />
              </View>

              {isLoading ? (
                <View style={styles.emptyState}>
                  <ActivityIndicator size="small" color={COLORS.green} />
                </View>
              ) : error ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>{error}</Text>
                </View>
              ) : (
                <View style={styles.listContainer}>
                  {lots.map((lot) => (
                    <TouchableOpacity
                      key={lot.id}
                      style={styles.lotItem}
                      activeOpacity={0.85}
                      onPress={() => handleOpenDetail(lot.id)}
                    >
                      <View
                        style={[
                          styles.lotDot,
                          {
                            backgroundColor: getAlertLotDotColor(lot),
                          },
                        ]}
                      />

                      <View style={styles.lotInfo}>
                        <Text style={styles.lotName}>{lot.lotName}</Text>
                      </View>

                      <Ionicons
                        name="arrow-forward"
                        size={18}
                        color={COLORS.green}
                      />
                    </TouchableOpacity>
                  ))}

                  {lots.length === 0 ? (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyStateText}>
                        No hay lotes que coincidan con tu búsqueda.
                      </Text>
                    </View>
                  ) : null}
                </View>
              )}
            </ScrollView>
          </View>

          <BottomNavigationBar activeRoute="Notifications" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
    fontSize: 14,
    lineHeight: 17,
    color: COLORS.gray,
    marginBottom: 18,
  },
  summaryRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryCard: {
    width: "31%",
    minHeight: 98,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  summaryCount: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 32,
    lineHeight: 36,
  },
  summaryLabel: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 13,
    lineHeight: 15,
    textAlign: "center",
    marginTop: 2,
  },
  searchContainer: {
    width: "100%",
    minHeight: 42,
    borderWidth: 1,
    borderColor: "rgba(93, 123, 61, 0.15)",
    borderRadius: 8,
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 14,
    color: COLORS.black,
    paddingVertical: 0,
  },
  listContainer: {
    width: "100%",
  },
  lotItem: {
    width: "100%",
    minHeight: 58,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.green,
    backgroundColor: COLORS.background,
    marginBottom: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  lotDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  lotInfo: {
    flex: 1,
  },
  lotName: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.green,
    fontSize: 16,
    lineHeight: 19,
  },
  emptyState: {
    paddingVertical: 18,
    alignItems: "center",
  },
  emptyStateText: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.gray,
    fontSize: 14,
    textAlign: "center",
  },
});