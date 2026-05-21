import React, { useMemo } from "react";
import {
  ActivityIndicator,
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
import Svg, { G, Path, Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { MaidenOrange_400Regular } from "@expo-google-fonts/maiden-orange";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../../../core/navigation/app_navigator";
import { AppHeader } from "../../../../shared/ui/app_header";
import { BottomNavigationBar } from "../../../../shared/ui/bottom_navigation_bar";
import {
  DetailAlertFilter,
  useDetailAlertViewModel,
} from "../viewmodels/detail_alert_viewmodel";

const COLORS = {
  green: "#5D7B3D",
  background: "#FFFFF1",
  gray: "#959595",
  // Severity colors
  critical: "#E4568B",   // ALTO - Alertas críticas
  warning: "#F6C94D",    // MEDIO - Alertas preventivas
  info: "#5D7B3D",       // BAJO - Alertas informativas
  resolved: "#959595",   // Resueltas - gris
  // Soft backgrounds
  softCritical: "#FDE7EC",
  softWarning: "#FEF8E3",
  softInfo: "#EBF1E5",
  softResolved: "#F0F0F0",
  // Filter chip colors
  filterAll: "#5D7B3D",
  filterActive: "#E4568B",
  filterResolved: "#959595",
};

type DetailAlertRouteProp = RouteProp<RootStackParamList, "DetailAlert">;

type ChartSegment = {
  key: string;
  label: string;
  count: number;
  value: number;
  color: string;
};

function getFilterColor(filter: DetailAlertFilter): string {
  const colors: Record<DetailAlertFilter, string> = {
    Todas: COLORS.filterAll,
    "Alertas activas": COLORS.filterActive,
    "Alertas resueltas": COLORS.filterResolved,
  };
  return colors[filter];
}

/** Returns dot color based on severity and resolved status */
function getAlertColors(severity: string, isResolved: boolean): {
  dot: string;
  background: string;
  text: string;
} {
  if (isResolved) {
    return {
      dot: COLORS.resolved,
      background: COLORS.softResolved,
      text: COLORS.resolved,
    };
  }
  switch (severity) {
    case "Crítica":
      return { dot: COLORS.critical, background: COLORS.softCritical, text: COLORS.critical };
    case "Preventiva":
      return { dot: COLORS.warning, background: COLORS.softWarning, text: "#C49A2A" };
    case "Informativa":
    default:
      return { dot: COLORS.info, background: COLORS.softInfo, text: COLORS.info };
  }
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {

  if (Math.abs(endAngle - startAngle) >= 359.9) {
    return `M ${x} ${y - radius} A ${radius} ${radius} 0 1 0 ${x} ${y + radius} A ${radius} ${radius} 0 1 0 ${x} ${y - radius} Z`;
  }
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${x} ${y} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

function ResponsivePieChart({
  data,
  size,
}: {
  data: ChartSegment[];
  size: number;
}) {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  const radius = size / 2 - 6;
  const center = size / 2;

  let startAngle = 0;

  // Single segment: render a full circle
  const isSingleSegment = data.length === 1;

  return (
    <View style={styles.chartContent}>
      <Svg width={size} height={size}>
        <G>
          {isSingleSegment ? (
            <Circle
              cx={center}
              cy={center}
              r={radius}
              fill={data[0].color}
            />
          ) : (
            data.map((segment) => {
              const angle = (segment.value / total) * 360;
              const path = describeArc(
                center,
                center,
                radius,
                startAngle,
                startAngle + angle
              );
              const currentStart = startAngle;
              startAngle += angle;
              return (
                <Path
                  key={`${segment.key}-${currentStart}`}
                  d={path}
                  fill={segment.color}
                />
              );
            })
          )}
        </G>
      </Svg>

      <View style={styles.legendContainer}>
        {data.map((segment) => (
          <View key={segment.key} style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: segment.color }]}
            />
            <View style={styles.legendTextBox}>
              <Text style={styles.legendLabel}>{segment.label}</Text>
              <Text style={[styles.legendValue, { color: segment.color }]}>
                {segment.count}{' '} ({segment.value.toFixed(1)}%)
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export function DetailAlertPage() {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = height < 700;
  const horizontalPadding = width < 360 ? 24 : width < 400 ? 32 : 42;
  const headerHeight = Math.min(Math.max(height * 0.17, 105), 140);
  const cardPaddingTop = isSmallPhone ? 28 : 40;
  const titleFontSize = width < 360 ? 34 : 38;

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<DetailAlertRouteProp>();

  const {
    lot,
    filters,
    selectedFilter,
    filteredAlerts,
    chartData,
    showOptionsMenu,
    isLoading,
    error,
    handleSelectFilter,
    handleToggleOptionsMenu,
    handleResolveActiveAlerts,
  } = useDetailAlertViewModel({
    lotId: route.params.lotId,
    lotName: route.params.lotName,
    onNotFound: () => {
      navigation.navigate("Notifications");
    },
  });

  const [fontsLoaded] = useFonts({
    MaidenOrange_400Regular,
  });

  const chartSize = useMemo(() => {
    const availableWidth = width - horizontalPadding * 2 - 30;
    return Math.max(150, Math.min(availableWidth * 0.64, 210));
  }, [horizontalPadding, width]);

  if (!fontsLoaded) {
    return null;
  }

  const showFilters = filters.length > 1;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <AppHeader imageHeight={headerHeight} />

          <TouchableOpacity
            style={styles.optionsButton}
            activeOpacity={0.75}
            onPress={handleToggleOptionsMenu}
          >
            <Ionicons name="ellipsis-vertical" size={20} color={COLORS.green} />
          </TouchableOpacity>

          {showOptionsMenu ? (
            <View style={styles.optionsMenu}>
              <TouchableOpacity
                style={styles.optionsMenuItem}
                activeOpacity={0.75}
                onPress={handleResolveActiveAlerts}
              >
                <Text style={styles.optionsMenuText}>
                  Marcar activas como resueltas
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

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
                  { fontSize: titleFontSize, lineHeight: titleFontSize + 4 },
                ]}
              >
                {lot.lotName}
              </Text>

              <Text style={styles.subtitle}>
                Información actual de tus alertas en el lote
              </Text>

              {isLoading ? (
                <View style={styles.emptyState}>
                  <ActivityIndicator size="small" color={COLORS.green} />
                </View>
              ) : error ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>{error}</Text>
                </View>
              ) : (
                <>
                  {chartData.length > 0 && (
                    <View style={styles.chartCard}>
                      <ResponsivePieChart data={chartData} size={chartSize} />
                    </View>
                  )}

                  {showFilters && (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.filtersContainer}
                      style={styles.filtersScroll}
                    >
                      {filters.map((filter) => {
                        const isSelected = selectedFilter === filter;
                        const chipColor = getFilterColor(filter);

                        return (
                          <TouchableOpacity
                            key={filter}
                            style={[
                              styles.filterChip,
                              {
                                borderColor: chipColor,
                                backgroundColor: isSelected
                                  ? chipColor
                                  : COLORS.background,
                              },
                            ]}
                            activeOpacity={0.8}
                            onPress={() => handleSelectFilter(filter)}
                          >
                            <Text
                              style={[
                                styles.filterChipText,
                                {
                                  color: isSelected
                                    ? COLORS.background
                                    : chipColor,
                                },
                              ]}
                            >
                              {filter}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  )}

                  <View style={styles.listContainer}>
                    {filteredAlerts.map((alertItem) => {
                      const isResolved = alertItem.status === "Resuelta";
                      const alertColors = getAlertColors(
                        alertItem.severity,
                        isResolved
                      );

                      return (
                        <View
                          key={alertItem.id}
                          style={[
                            styles.alertCard,
                            { backgroundColor: alertColors.background },
                          ]}
                        >
                          <View
                            style={[
                              styles.alertDot,
                              { backgroundColor: alertColors.dot },
                            ]}
                          />
                          <View style={styles.alertTextBox}>
                            <Text
                              style={[
                                styles.alertTitle,
                                { color: alertColors.text },
                              ]}
                            >
                              {alertItem.title}
                            </Text>
                            <Text style={styles.alertDate}>
                              {alertItem.timeAgo}
                            </Text>
                          </View>
                        </View>
                      );
                    })}

                    {filteredAlerts.length === 0 ? (
                      <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>
                          No hay alertas para este filtro.
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </>
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
  optionsButton: {
    position: "absolute",
    top: 18,
    right: 16,
    zIndex: 20,
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  optionsMenu: {
    position: "absolute",
    top: 48,
    right: 14,
    zIndex: 30,
    width: 170,
    borderRadius: 6,
    backgroundColor: COLORS.background,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 4,
  },
  optionsMenuItem: {
    minHeight: 42,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  optionsMenuText: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.green,
    fontSize: 13,
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
    fontSize: 13,
    lineHeight: 16,
    color: COLORS.gray,
    marginBottom: 10,
  },
  chartCard: {
    width: "100%",
    paddingVertical: 8,
    marginBottom: 10,
  },
  chartContent: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  legendContainer: {
    width: "100%",
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendTextBox: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },
  legendLabel: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.green,
    fontSize: 13,
    flex: 1,
  },
  legendValue: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 12,
    marginLeft: 6,
  },
  filtersScroll: {
    marginBottom: 12,
    maxHeight: 28,
  },
  filtersContainer: {
    alignItems: "center",
  },
  filterChip: {
    minHeight: 24,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  filterChipText: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 12,
    lineHeight: 14,
  },
  listContainer: {
    width: "100%",
  },
  alertCard: {
    width: "100%",
    minHeight: 54,
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  alertDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 12,
  },
  alertTextBox: {
    flex: 1,
  },
  alertTitle: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 13,
    lineHeight: 15,
  },
  alertDate: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.gray,
    fontSize: 12,
    lineHeight: 14,
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