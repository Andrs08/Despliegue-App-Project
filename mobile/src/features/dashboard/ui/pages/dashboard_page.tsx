import React, { useMemo, useState } from "react";
import {
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
import Svg, { G, Line, Path, Rect, Text as SvgText } from "react-native-svg";
import { useFonts } from "expo-font";
import { GravitasOne_400Regular } from "@expo-google-fonts/gravitas-one";
import { MaidenOrange_400Regular } from "@expo-google-fonts/maiden-orange";
import { AlfaSlabOne_400Regular } from "@expo-google-fonts/alfa-slab-one";

import { AppHeader } from "../../../../shared/ui/app_header";
import { BottomNavigationBar } from "../../../../shared/ui/bottom_navigation_bar";

type ChartType = "produccion" | "riesgo" | "etapas" | "alertas";

type SummaryCard = {
  value: string;
  label: string;
  borderColor: string;
  textColor: string;
  backgroundColor: string;
};

type PieItem = {
  label: string;
  value: number;
  color: string;
};

type ProductionItem = {
  label: string;
  estimated: number;
  real: number;
};

const COLORS = {
  green: "#5D7B3D",
  black: "#000000",
  background: "#FFFFF1",
  yellow: "#F6C94D",
  blue: "#4A7DBA",
  purple: "#8E44AD",
  pink: "#E4568B",
  gray: "#959595",
  lightBlue: "#E8F1FB",
  lightGreen: "#EAF4E7",
  lightPurple: "#F1EAF8",
  stroke: "#CFCFC5",
};

const summaryCards: SummaryCard[] = [
  {
    value: "5",
    label: "Total de\nlotes",
    borderColor: COLORS.green,
    textColor: COLORS.green,
    backgroundColor: COLORS.lightGreen,
  },
  {
    value: "9",
    label: "Alertas\nactivas",
    borderColor: COLORS.yellow,
    textColor: COLORS.yellow,
    backgroundColor: COLORS.background,
  },
  {
    value: "55",
    label: "Total de\nbitácoras",
    borderColor: COLORS.pink,
    textColor: COLORS.pink,
    backgroundColor: COLORS.background,
  },
  {
    value: "5",
    label: "Total de\nplantas",
    borderColor: COLORS.blue,
    textColor: COLORS.blue,
    backgroundColor: COLORS.lightBlue,
  },
  {
    value: "3",
    label: "Lotes en\nriesgo",
    borderColor: COLORS.purple,
    textColor: COLORS.purple,
    backgroundColor: COLORS.lightPurple,
  },
];

const productionData: ProductionItem[] = [
  {
    label: "lote A",
    estimated: 4000,
    real: 3500,
  },
  {
    label: "lote A",
    estimated: 3200,
    real: 2700,
  },
  {
    label: "Lote b",
    estimated: 2200,
    real: 1200,
  },
];

const riskData: PieItem[] = [
  {
    label: "Sano",
    value: 41.2,
    color: COLORS.green,
  },
  {
    label: "Observación",
    value: 35.3,
    color: COLORS.yellow,
  },
  {
    label: "Riesgo",
    value: 23.5,
    color: COLORS.pink,
  },
];

const alertsData: PieItem[] = [
  {
    label: "Alertas informativas",
    value: 41.2,
    color: COLORS.blue,
  },
  {
    label: "Alertas preventivas",
    value: 35.3,
    color: COLORS.yellow,
  },
  {
    label: "Alertas críticas",
    value: 23.5,
    color: COLORS.pink,
  },
];

const chartOptions: { key: ChartType; label: string }[] = [
  {
    key: "produccion",
    label: "Producción",
  },
  {
    key: "riesgo",
    label: "Riesgo",
  },
  {
    key: "etapas",
    label: "Etapas",
  },
  {
    key: "alertas",
    label: "Alertas",
  },
];

export function DashboardPage() {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = height < 700;
  const horizontalPadding = width < 360 ? 16 : width < 420 ? 22 : 30;
  const headerHeight = Math.min(Math.max(height * 0.17, 105), 140);
  const cardPaddingTop = isSmallPhone ? 24 : 34;
  const titleFontSize = width < 360 ? 32 : 36;

  const [selectedChart, setSelectedChart] =
    useState<ChartType>("produccion");

  const [fontsLoaded] = useFonts({
    GravitasOne_400Regular,
    MaidenOrange_400Regular,
    AlfaSlabOne_400Regular,
  });

  const renderedChart = useMemo(() => {
    if (selectedChart === "produccion") {
      return <ProductionChart />;
    }

    if (selectedChart === "riesgo") {
      return <PieChartBlock data={riskData} />;
    }

    if (selectedChart === "etapas") {
      return <StagesTreeMap />;
    }

    return <PieChartBlock data={alertsData} />;
  }, [selectedChart]);

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
                Hola, xxx
              </Text>

              <Text style={styles.subtitle}>
                Aquí tienes un resumen de tus cultivos
              </Text>

              <View style={styles.summaryWrapper}>
                <View style={styles.summaryRow}>
                  {summaryCards.slice(0, 3).map((item) => (
                    <View
                      key={item.label}
                      style={[
                        styles.summaryCard,
                        {
                          borderColor: item.borderColor,
                          backgroundColor: item.backgroundColor,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.summaryValue,
                          {
                            color: item.textColor,
                          },
                        ]}
                      >
                        {item.value}
                      </Text>

                      <Text style={styles.summaryLabel}>{item.label}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.summaryRowBottom}>
                  {summaryCards.slice(3).map((item) => (
                    <View
                      key={item.label}
                      style={[
                        styles.summaryCard,
                        styles.summaryCardBottom,
                        {
                          borderColor: item.borderColor,
                          backgroundColor: item.backgroundColor,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.summaryValue,
                          {
                            color: item.textColor,
                          },
                        ]}
                      >
                        {item.value}
                      </Text>

                      <Text style={styles.summaryLabel}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.filtersRow}>
                {chartOptions.map((option) => {
                  const isActive = selectedChart === option.key;

                  return (
                    <TouchableOpacity
                      key={option.key}
                      style={[
                        styles.filterButton,
                        isActive ? styles.filterButtonActive : null,
                      ]}
                      activeOpacity={0.85}
                      onPress={() => setSelectedChart(option.key)}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          isActive ? styles.filterButtonTextActive : null,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.chartWrapper}>{renderedChart}</View>
            </ScrollView>
          </View>

          <BottomNavigationBar activeRoute="Dashboard" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ProductionChart() {
  const chartWidth = 340;
  const chartHeight = 290;

  const leftPadding = 44;
  const rightPadding = 20;
  const topPadding = 34;
  const bottomPadding = 34;

  const innerWidth = chartWidth - leftPadding - rightPadding;
  const innerHeight = chartHeight - topPadding - bottomPadding;

  const maxValue = 4000;
  const yTicks = [0, 1000, 2000, 3000, 4000];
  const groupWidth = innerWidth / productionData.length;
  const singleBarWidth = 34;
  const groupInnerGap = 4;

  return (
    <View style={styles.chartTransparentBox}>
      <View style={styles.legendRow}>
        <View style={styles.legendRowItem}>
          <View
            style={[
              styles.legendDot,
              {
                backgroundColor: COLORS.blue,
              },
            ]}
          />
          <Text style={styles.legendRowText}>Producción estimada</Text>
        </View>

        <View style={styles.legendRowItem}>
          <View
            style={[
              styles.legendDot,
              {
                backgroundColor: COLORS.purple,
              },
            ]}
          />
          <Text style={styles.legendRowText}>Producción real</Text>
        </View>
      </View>

      <Svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
        {yTicks.map((tick) => {
          const y =
            topPadding + innerHeight - (tick / maxValue) * innerHeight;

          return (
            <G key={tick}>
              <Line
                x1={leftPadding}
                y1={y}
                x2={chartWidth - rightPadding}
                y2={y}
                stroke={COLORS.stroke}
                strokeWidth={1}
              />
              <SvgText
                x={leftPadding - 8}
                y={y + 4}
                fontSize="12"
                fill="#555555"
                textAnchor="end"
              >
                {tick.toLocaleString("es-CO")}
              </SvgText>
            </G>
          );
        })}

        {productionData.map((item, index) => {
          const groupX = leftPadding + index * groupWidth;
          const totalBarsWidth = singleBarWidth * 2 + groupInnerGap;
          const startX = groupX + (groupWidth - totalBarsWidth) / 2;

          const estimatedHeight = (item.estimated / maxValue) * innerHeight;
          const realHeight = (item.real / maxValue) * innerHeight;

          const estimatedY = topPadding + innerHeight - estimatedHeight;
          const realY = topPadding + innerHeight - realHeight;

          return (
            <G key={`${item.label}-${index}`}>
              <Rect
                x={startX}
                y={estimatedY}
                width={singleBarWidth}
                height={estimatedHeight}
                rx={4}
                fill={COLORS.blue}
              />

              <Rect
                x={startX + singleBarWidth + groupInnerGap}
                y={realY}
                width={singleBarWidth}
                height={realHeight}
                rx={4}
                fill={COLORS.purple}
              />

              <SvgText
                x={groupX + groupWidth / 2}
                y={chartHeight - 10}
                fontSize="13"
                fill="#555555"
                textAnchor="middle"
              >
                {item.label}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

function PieChartBlock({ data }: { data: PieItem[] }) {
  const size = 280;
  const radius = 110;
  const center = size / 2;

  let cumulativeAngle = -90;

  const slices = data.map((item) => {
    const startAngle = cumulativeAngle;
    const sweepAngle = (item.value / 100) * 360;
    const endAngle = cumulativeAngle + sweepAngle;

    cumulativeAngle = endAngle;

    return {
      ...item,
      startAngle,
      endAngle,
    };
  });

  return (
    <View style={styles.chartTransparentBox}>
      <Svg width="100%" height={320} viewBox={`0 0 ${size} 320`}>
        {slices.map((slice) => (
          <Path
            key={slice.label}
            d={describePieSlice(
              center,
              center,
              radius,
              slice.startAngle,
              slice.endAngle
            )}
            fill={slice.color}
          />
        ))}

        {slices.map((slice) => {
          const labelAngle = (slice.startAngle + slice.endAngle) / 2;
          const labelRadius = radius + 26;
          const labelPosition = polarToCartesian(
            center,
            center,
            labelRadius,
            labelAngle
          );

          const lines = splitLabel(slice.label);

          return (
            <G key={`${slice.label}-label`}>
              {lines.map((line, lineIndex) => (
                <SvgText
                  key={`${slice.label}-${lineIndex}`}
                  x={labelPosition.x}
                  y={labelPosition.y + lineIndex * 14}
                  fontSize="12"
                  fill="#444444"
                  textAnchor={
                    labelPosition.x >= center ? "start" : "end"
                  }
                >
                  {line}
                </SvgText>
              ))}

              <SvgText
                x={labelPosition.x}
                y={labelPosition.y + lines.length * 14}
                fontSize="12"
                fill="#444444"
                textAnchor={labelPosition.x >= center ? "start" : "end"}
              >
                {`${slice.value.toFixed(1).replace(".", ",")}%`}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

function StagesTreeMap() {
  return (
    <View style={styles.chartTransparentBox}>
      <View style={styles.treeContainer}>
        <View style={[styles.treeTopBlock, { backgroundColor: COLORS.green }]}>
          <Text style={styles.treeDarkText}>Preparación del suelo</Text>
        </View>

        <View style={styles.treeBottomRow}>
          <View
            style={[
              styles.treeLeftBlock,
              {
                backgroundColor: COLORS.pink,
              },
            ]}
          >
            <Text style={styles.treeDarkText}>Desarrollo vegetativo</Text>
          </View>

          <View style={styles.treeRightColumn}>
            <View
              style={[
                styles.treeCosechaBlock,
                {
                  backgroundColor: "#827CEB",
                },
              ]}
            >
              <Text style={styles.treeDarkText}>Cosecha</Text>
            </View>

            <View style={styles.treeRightBottomRow}>
              <View
                style={[
                  styles.treeFructBlock,
                  {
                    backgroundColor: COLORS.purple,
                  },
                ]}
              >
                <Text style={styles.treeSmallText}>Fructificación</Text>
              </View>

              <View style={styles.treeRightMiniColumn}>
                <View
                  style={[
                    styles.treeFlorBlock,
                    {
                      backgroundColor: COLORS.blue,
                    },
                  ]}
                >
                  <Text style={styles.treeDarkText}>Floración</Text>
                </View>

                <View
                  style={[
                    styles.treeSiembraBlock,
                    {
                      backgroundColor: COLORS.yellow,
                    },
                  ]}
                >
                  <Text style={styles.treeSmallTextDark}>Siembra</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180;

  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

function describePieSlice(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

function splitLabel(label: string) {
  if (label === "Alertas informativas") {
    return ["Alertas", "informativas"];
  }

  if (label === "Alertas preventivas") {
    return ["Alertas preventivas"];
  }

  if (label === "Alertas críticas") {
    return ["Alertas críticas"];
  }

  return [label];
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
    fontSize: 14,
    lineHeight: 17,
    color: COLORS.gray,
    marginBottom: 16,
  },
  summaryWrapper: {
    width: "100%",
    marginBottom: 16,
  },
  summaryRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryRowBottom: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
  },
  summaryCard: {
    width: "31%",
    minHeight: 66,
    borderWidth: 1.2,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  summaryCardBottom: {
    width: "31%",
  },
  summaryValue: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 23,
    lineHeight: 25,
    marginBottom: 2,
  },
  summaryLabel: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 10,
    lineHeight: 12,
    color: COLORS.black,
    textAlign: "center",
  },
  filtersRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  filterButton: {
    minWidth: 74,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.green,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  filterButtonActive: {
    backgroundColor: COLORS.green,
  },
  filterButtonText: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 14,
    lineHeight: 17,
    color: COLORS.green,
  },
  filterButtonTextActive: {
    color: COLORS.background,
  },
  chartWrapper: {
    width: "100%",
    backgroundColor: COLORS.background,
  },
  chartTransparentBox: {
    width: "100%",
    backgroundColor: COLORS.background,
  },
  legendRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginBottom: 2,
  },
  legendRowItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendRowText: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 12,
    lineHeight: 14,
    color: "#444444",
  },
  treeContainer: {
    width: "100%",
    height: 270,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: "#DDDDD2",
  },
  treeTopBlock: {
    height: "27%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: COLORS.background,
  },
  treeBottomRow: {
    flex: 1,
    flexDirection: "row",
  },
  treeLeftBlock: {
    width: "52%",
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 2,
    borderRightColor: COLORS.background,
  },
  treeRightColumn: {
    flex: 1,
  },
  treeCosechaBlock: {
    height: "42%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: COLORS.background,
  },
  treeRightBottomRow: {
    flex: 1,
    flexDirection: "row",
  },
  treeFructBlock: {
    width: "35%",
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 2,
    borderRightColor: COLORS.background,
  },
  treeRightMiniColumn: {
    flex: 1,
  },
  treeFlorBlock: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: COLORS.background,
  },
  treeSiembraBlock: {
    height: "22%",
    justifyContent: "center",
    alignItems: "center",
  },
  treeDarkText: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 17,
    lineHeight: 20,
    color: "#222222",
    textAlign: "center",
    paddingHorizontal: 8,
  },
  treeSmallText: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 11,
    lineHeight: 13,
    color: "#222222",
    textAlign: "center",
    paddingHorizontal: 4,
  },
  treeSmallTextDark: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 11,
    lineHeight: 13,
    color: "#222222",
    textAlign: "center",
    paddingHorizontal: 2,
  },
});