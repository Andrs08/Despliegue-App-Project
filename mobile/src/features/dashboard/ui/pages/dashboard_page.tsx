import React, { useMemo, useState } from "react";
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
import Svg, { G, Line, Path, Rect, Text as SvgText } from "react-native-svg";
import { useFonts } from "expo-font";
import { GravitasOne_400Regular } from "@expo-google-fonts/gravitas-one";
import { MaidenOrange_400Regular } from "@expo-google-fonts/maiden-orange";
import { AlfaSlabOne_400Regular } from "@expo-google-fonts/alfa-slab-one";
import { treemap, hierarchy } from "d3-hierarchy";
import { AppHeader } from "../../../../shared/ui/app_header";
import { BottomNavigationBar } from "../../../../shared/ui/bottom_navigation_bar";
import { useDashboard } from "../viewmodels/hooks/use-dasboard_viewmodel.ts";
import {
  DashboardData,
  Production,
  LotStatus,
  ActiveAlerts,
  StageDistribution,
} from "../../domain/interfaces/dashboard.interfaces";

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
  red: "#D9534F",
};

const chartOptions: { key: ChartType; label: string }[] = [
  { key: "produccion", label: "Producción" },
  { key: "riesgo", label: "Riesgo" },
  { key: "etapas", label: "Etapas" },
  { key: "alertas", label: "Alertas" },
];

function buildSummaryCards(data: DashboardData): SummaryCard[] {
  return [
    {
      value: String(data.summary.total_lotes),
      label: "Total de\nlotes",
      borderColor: COLORS.green,
      textColor: COLORS.green,
      backgroundColor: COLORS.lightGreen,
    },
    {
      value: String(data.summary.alertas_activas),
      label: "Alertas\nactivas",
      borderColor: COLORS.yellow,
      textColor: COLORS.yellow,
      backgroundColor: COLORS.background,
    },
    {
      value: String(data.summary.total_plantas),
      label: "Total de\nplantas",
      borderColor: COLORS.pink,
      textColor: COLORS.pink,
      backgroundColor: COLORS.background,
    },
    {
      value: String(data.summary.total_hectareas.toFixed(1)),
      label: "Total de\nhectáreas",
      borderColor: COLORS.blue,
      textColor: COLORS.blue,
      backgroundColor: COLORS.lightBlue,
    },
    {
      value: String(data.summary.lotes_riesgo),
      label: "Lotes en\nriesgo",
      borderColor: COLORS.purple,
      textColor: COLORS.purple,
      backgroundColor: COLORS.lightPurple,
    },
  ];
}

function buildProductionData(production: Production[]): ProductionItem[] {
  return production.map((p) => ({
    label: p.lote_nombre ?? p.lote_id,
    estimated: p.produccion_estimada,
    real: p.produccion_real ?? 0,
  }));
}

function buildRiskData(lotStatus: LotStatus): PieItem[] {
  const total = lotStatus.sanos + lotStatus.observacion + lotStatus.riesgo;
  if (total === 0) return [];
  return [
    {
      label: `Sano (${lotStatus.sanos})`,
      value: (lotStatus.sanos / total) * 100,
      color: COLORS.green,
    },
    {
      label: `Observación (${lotStatus.observacion})`,
      value: (lotStatus.observacion / total) * 100,
      color: COLORS.yellow,
    },
    {
      label: `Riesgo (${lotStatus.riesgo})`,
      value: (lotStatus.riesgo / total) * 100,
      color: COLORS.pink,
    },
  ].filter((item) => item.value > 0);
}

function buildAlertsData(activeAlerts: ActiveAlerts): PieItem[] {
  const total = activeAlerts.total;
  if (total === 0) return [];
  const colorMap: Record<string, string> = {
    alto: COLORS.pink,
    medio: COLORS.yellow,
    bajo: COLORS.blue,
  };

  return activeAlerts.niveles
    .filter((n) => n._count > 0)
    .map((n) => {
      const nivel = (n.nivel ?? "sin nivel").toLowerCase();
      return {
        label: `${n.nivel} (${n._count})`,
        value: (n._count / total) * 100,
        color: colorMap[nivel] ?? COLORS.gray,
      };
    });
}

export function DashboardPage() {
  const { width, height } = useWindowDimensions();
  const { data, userName,loading, error, isFromCache } = useDashboard();

  const isSmallPhone = height < 700;
  const horizontalPadding = width < 360 ? 16 : width < 420 ? 22 : 30;
  const headerHeight = Math.min(Math.max(height * 0.17, 105), 140);
  const cardPaddingTop = isSmallPhone ? 24 : 34;
  const titleFontSize = width < 360 ? 32 : 36;
  const chartWidth = width - horizontalPadding * 3;
  const [selectedChart, setSelectedChart] = useState<ChartType>("produccion");

  const [fontsLoaded] = useFonts({
    GravitasOne_400Regular,
    MaidenOrange_400Regular,
    AlfaSlabOne_400Regular,
  });

  const summaryCards = useMemo(
    () => (data ? buildSummaryCards(data) : []),
    [data]
  );
  const productionData = useMemo(
    () => (data ? buildProductionData(data.production) : []),
    [data]
  );
  const riskData = useMemo(
    () => (data ? buildRiskData(data.lotStatus) : []),
    [data]
  );
  const alertsData = useMemo(
    () => (data ? buildAlertsData(data.activeAlerts) : []),
    [data]
  );
  const stageDistribution = useMemo(
    () => data?.stageDistribution ?? [],
    [data]
  );

  const renderedChart = useMemo(() => {
    if (!data) return null;

    if (selectedChart === "produccion") {
      return <ProductionChart data={productionData} containerWidth={chartWidth} />;
    }
    if (selectedChart === "riesgo") {
      return <PieChartBlock data={riskData} containerWidth={chartWidth} />;
    }
    if (selectedChart === "etapas") {
      return (
        <StagesTreeMap
          stageDistribution={stageDistribution}
          containerWidth={chartWidth}
        />
      );
    }
    return <PieChartBlock data={alertsData} containerWidth={chartWidth} />;
  }, [selectedChart, data, productionData, riskData, alertsData, stageDistribution, chartWidth]);

  if (!fontsLoaded) return null;

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
                Hola, {userName}
              </Text>

              <Text style={styles.subtitle}>
                Aquí tienes un resumen de tus cultivos
              </Text>

              {isFromCache && (
                <Text style={styles.cacheNotice}>
                  Mostrando datos sin conexión
                </Text>
              )}

              {loading && !data && (
                <ActivityIndicator
                  size="large"
                  color={COLORS.green}
                  style={{ marginTop: 32 }}
                />
              )}

              {error && !data && (
                <Text style={styles.errorText}>{error}</Text>
              )}

              {data && (
                <>
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
                              { color: item.textColor },
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
                              { color: item.textColor },
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
                </>
              )}
            </ScrollView>
          </View>

          <BottomNavigationBar activeRoute="Dashboard" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ProductionChart({
  data,
  containerWidth,
}: {
  data: ProductionItem[];
  containerWidth: number;
}) {
  const chartWidth = containerWidth;
  const chartHeight = Math.round(containerWidth * 0.82);

  const leftPadding = 44;
  const rightPadding = 20;
  const topPadding = 34;
  const LABEL_AREA = 80;
  const bottomPadding = LABEL_AREA;

  const innerWidth = chartWidth - leftPadding - rightPadding;
  const innerHeight = chartHeight - topPadding - bottomPadding;

  const allValues = data.flatMap((d) => [d.estimated, d.real]);
  const maxValue = allValues.length > 0 ? Math.max(...allValues, 1000) : 4000;
  const niceMax = Math.ceil(maxValue / 1000) * 1000;
  const step = niceMax / 4;
  const yTicks = [0, step, step * 2, step * 3, niceMax];

  const groupWidth = data.length > 0 ? innerWidth / data.length : innerWidth;
  const singleBarWidth = Math.min(34, Math.floor(groupWidth / 3));
  const groupInnerGap = 4;

  if (data.length === 0) {
    return (
      <View style={styles.chartTransparentBox}>
        <Text style={styles.emptyChartText}>Sin datos de producción</Text>
      </View>
    );
  }

  return (
    <View style={styles.chartTransparentBox}>
      <View style={styles.legendRow}>
        <View style={styles.legendRowItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.blue }]} />
          <Text style={styles.legendRowText}>Producción estimada</Text>
        </View>
        <View style={styles.legendRowItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.purple }]} />
          <Text style={styles.legendRowText}>Producción real</Text>
        </View>
      </View>

      <Svg
        width="100%"
        height={chartHeight}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      >
        {yTicks.map((tick) => {
          const y = topPadding + innerHeight - (tick / niceMax) * innerHeight;
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

        {data.map((item, index) => {
          const groupX = leftPadding + index * groupWidth;
          const totalBarsWidth = singleBarWidth * 2 + groupInnerGap;
          const startX = groupX + (groupWidth - totalBarsWidth) / 2;

          const estimatedHeight = (item.estimated / niceMax) * innerHeight;
          const realHeight = (item.real / niceMax) * innerHeight;
          const estimatedY = topPadding + innerHeight - estimatedHeight;
          const realY = topPadding + innerHeight - realHeight;
          const labelX = groupX + groupWidth / 2;
          const labelY = topPadding + innerHeight + 8;

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
                x={labelX}
                y={labelY}
                fontSize="12"
                fill="#555555"
                textAnchor="end"
                rotation="-45"
                originX={labelX}
                originY={labelY}
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

function PieChartBlock({
  data,
  containerWidth,
}: {
  data: PieItem[];
  containerWidth: number;
}) {
  if (data.length === 0) {
    return (
      <View style={styles.chartTransparentBox}>
        <Text style={styles.emptyChartText}>Sin datos disponibles</Text>
      </View>
    );
  }

  const size = containerWidth;
  const radius = Math.round(size * 0.28);
  const center = size / 2;
  const svgHeight = Math.round(size * 1.1);

  let cumulativeAngle = -90;
  const slices = data.map((item) => {
    const startAngle = cumulativeAngle;
    const sweepAngle = (item.value / 100) * 360;
    const endAngle = cumulativeAngle + sweepAngle;
    cumulativeAngle = endAngle;
    return { ...item, startAngle, endAngle };
  });

  return (
    <View style={styles.chartTransparentBox}>
      <Svg width="100%" height={svgHeight} viewBox={`0 0 ${size} ${svgHeight}`}>
        {slices.map((slice) => (
          <Path
            key={slice.label}
            d={describePieSlice(center, center, radius, slice.startAngle, slice.endAngle)}
            fill={slice.color}
          />
        ))}

        {slices.map((slice) => {
          const labelAngle = (slice.startAngle + slice.endAngle) / 2;
          const labelRadius = radius + Math.round(radius * 0.24);
          const labelPosition = polarToCartesian(center, center, labelRadius, labelAngle);
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
                  textAnchor={labelPosition.x >= center ? "start" : "end"}
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

const STAGE_COLORS: Record<number, string> = {
  1: COLORS.green,
  2: COLORS.yellow,
  3: COLORS.pink,
  4: COLORS.blue,
  5: COLORS.purple,
  6: "#827CEB",
};

const STAGE_NAMES: Record<number, string> = {
  1: "Preparación",
  2: "Siembra",
  3: "Desarrollo",
  4: "Floración",
  5: "Fructificación",
  6: "Cosecha",
};

function StagesTreeMap({
  stageDistribution,
  containerWidth,
}: {
  stageDistribution: StageDistribution[];
  containerWidth: number;
}) {
  if (stageDistribution.length === 0) {
    return (
      <View style={styles.chartTransparentBox}>
        <Text style={styles.emptyChartText}>Sin datos de etapas</Text>
      </View>
    );
  }

  const svgWidth = containerWidth;
  const svgHeight = Math.round(containerWidth * 0.9);

  const data = {
    name: "stages",
    children: stageDistribution.map((stage) => ({
      name: STAGE_NAMES[stage.etapa_actual_id!],
      value: stage._count,
      stageId: stage.etapa_actual_id,
    })),
  };

  const root = hierarchy(data).sum((d: any) => d.value);
  const tree = treemap<any>().size([svgWidth, svgHeight]).padding(2)(root);

  return (
    <View style={styles.chartTransparentBox}>
      <Svg
        width="100%"
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      >
        {tree.leaves().map((leaf, index) => {
          const stageId = leaf.data.stageId;
          const cellW = leaf.x1 - leaf.x0;
          const cellH = leaf.y1 - leaf.y0;
          const fontSize = Math.max(9, Math.min(13, Math.round(cellW / 7)));

          return (
            <G key={index}>
              <Rect
                x={leaf.x0}
                y={leaf.y0}
                width={cellW}
                height={cellH}
                fill={STAGE_COLORS[stageId] ?? COLORS.gray}
                rx={6}
              />
              <SvgText
                x={leaf.x0 + cellW / 2}
                y={leaf.y0 + cellH / 2}
                fontSize={fontSize}
                fill="#222222"
                textAnchor="middle"
              >
                {leaf.data.name}
              </SvgText>
              <SvgText
                x={leaf.x0 + cellW / 2}
                y={leaf.y0 + cellH / 2 + fontSize + 3}
                fontSize={Math.max(9, fontSize - 1)}
                fill="#222222"
                textAnchor="middle"
              >
                ({leaf.data.value})
              </SvgText>
            </G>
          );
        })}
      </Svg>
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

function splitLabel(label: string): string[] {
  const words = label.split(" ");
  if (words.length > 2) {
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
  }
  return [label];
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  keyboardView: { flex: 1, backgroundColor: COLORS.background },
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
  content: { flexGrow: 1, paddingBottom: 90 },
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
  cacheNotice: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 11,
    color: COLORS.yellow,
    marginBottom: 8,
  },
  errorText: {
    color: COLORS.red,
    marginTop: 24,
    textAlign: "center",
  },
  summaryWrapper: { width: "100%", marginBottom: 16 },
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
  summaryCardBottom: { width: "31%" },
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
  filterButtonActive: { backgroundColor: COLORS.green },
  filterButtonText: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 14,
    lineHeight: 17,
    color: COLORS.green,
  },
  filterButtonTextActive: { color: COLORS.background },
  chartWrapper: { width: "100%", backgroundColor: COLORS.background },
  chartTransparentBox: { width: "100%", backgroundColor: COLORS.background },
  emptyChartText: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    marginTop: 32,
  },
  legendRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginBottom: 2,
  },
  legendRowItem: { flexDirection: "row", alignItems: "center" },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 5 },
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
  treeBottomRow: { flex: 1, flexDirection: "row" },
  treeLeftBlock: {
    width: "52%",
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 2,
    borderRightColor: COLORS.background,
  },
  treeRightColumn: { flex: 1 },
  treeCosechaBlock: {
    height: "42%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: COLORS.background,
  },
  treeRightBottomRow: { flex: 1, flexDirection: "row" },
  treeFructBlock: {
    width: "35%",
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 2,
    borderRightColor: COLORS.background,
  },
  treeRightMiniColumn: { flex: 1 },
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