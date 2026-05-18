import React from "react";
import {
  ActivityIndicator,
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

import { AppHeader } from "../../../../shared/ui/app_header";
import { BottomNavigationBar } from "../../../../shared/ui/bottom_navigation_bar";
import { useDashboard } from "../../application/hooks/use-dasboard.hook";

// ─── Helpers ────────────────────────────────────────────────────────────────

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

function StatusDot({ color, label, count }: { color: string; label: string; count: number }) {
  return (
    <View style={styles.statusRow}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.statusLabel}>{label}</Text>
      <Text style={styles.statusCount}>{count}</Text>
    </View>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const { width, height } = useWindowDimensions();
  const { data, loading, error, isFromCache, refresh } = useDashboard();

  const isSmallPhone = height < 700;
  const horizontalPadding = width < 360 ? 24 : width < 400 ? 32 : 42;
  const headerHeight = Math.min(Math.max(height * 0.17, 105), 140);
  const cardPaddingTop = isSmallPhone ? 32 : 42;
  const titleFontSize = width < 360 ? 36 : 40;

  const [fontsLoaded] = useFonts({
    GravitasOne_400Regular,
    MaidenOrange_400Regular,
    AlfaSlabOne_400Regular,
  });

  if (!fontsLoaded) return null;

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
                {/* ── Header ── */}
                <Text
                  style={[
                    styles.title,
                    { fontSize: titleFontSize, lineHeight: titleFontSize + 3 },
                  ]}
                >
                  Dashboard
                </Text>
                <Text style={styles.subtitle}>
                  Resumen de tus cultivos
                </Text>

                {isFromCache && (
                  <Text style={styles.cacheNotice}>
                    Mostrando datos sin conexión
                  </Text>
                )}

                {/* ── Loading ── */}
                {loading && !data && (
                  <ActivityIndicator
                    size="large"
                    color={COLORS.green}
                    style={{ marginTop: 32 }}
                  />
                )}

                {/* ── Error ── */}
                {error && !data && (
                  <Text style={styles.errorText}>{error}</Text>
                )}

                {/* ── Resumen general ── */}
                {data && (
                  <>
                    <Text style={styles.sectionTitle}>Resumen General</Text>
                    <View style={styles.summaryGrid}>
                      <SummaryCard
                        label="Lotes"
                        value={data.summary.total_lotes}
                      />
                      <SummaryCard
                        label="Hectáreas"
                        value={data.summary.total_hectareas.toFixed(1)}
                      />
                      <SummaryCard
                        label="Plantas"
                        value={data.summary.total_plantas}
                      />
                      <SummaryCard
                        label="Alertas"
                        value={data.summary.alertas_activas}
                      />
                    </View>

                    {/* ── Estado de lotes ── */}
                    <Text style={styles.sectionTitle}>Estado de Lotes</Text>
                    <View style={styles.statusContainer}>
                      <StatusDot
                        color={COLORS.red}
                        label="En riesgo"
                        count={data.lotStatus.riesgo}
                      />
                      <StatusDot
                        color={COLORS.yellow}
                        label="Observación"
                        count={data.lotStatus.observacion}
                      />
                      <StatusDot
                        color={COLORS.green}
                        label="Sanos"
                        count={data.lotStatus.sanos}
                      />
                    </View>

                    {/* ── Alertas activas ── */}
                    <Text style={styles.sectionTitle}>
                      Alertas Activas ({data.activeAlerts.total})
                    </Text>
                    {data.activeAlerts.niveles.map((n) => (
                      <View key={n.nivel ?? "sin-nivel"} style={styles.alertRow}>
                        <Text style={styles.alertNivel}>
                          {n.nivel ?? "Sin nivel"}
                        </Text>
                        <Text style={styles.alertCount}>{n._count}</Text>
                      </View>
                    ))}

                    {/* ── Producción por lote ── */}
                    <Text style={styles.sectionTitle}>Producción por Lote</Text>
                    {data.production.map((p) => (
                      <View key={p.lote_id} style={styles.productionRow}>
                        <Text style={styles.productionName}>
                          {p.lote_nombre ?? p.lote_id}
                        </Text>
                        <View style={styles.productionValues}>
                          <Text style={styles.productionLabel}>
                            Est: {p.produccion_estimada} kg
                          </Text>
                          {p.produccion_real != null && p.produccion_real > 0 && (
                            <Text style={styles.productionLabelReal}>
                              Real: {p.produccion_real} kg
                            </Text>
                          )}
                        </View>
                      </View>
                    ))}
                  </>
                )}
              </ScrollView>
            </View>

            <BottomNavigationBar activeRoute="Dashboard" />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const COLORS = {
  green: "#5D7B3D",
  background: "#FFFFF1",
  gray: "#959595",
  darkBackground: "#202020",
  red: "#D9534F",
  yellow: "#E8A838",
  lightGray: "#F0F0E0",
  border: "#E0E0CC",
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  keyboardView: { flex: 1, backgroundColor: COLORS.background },
  screenWrapper: { flex: 1, backgroundColor: COLORS.background },
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
  content: { flexGrow: 1, paddingBottom: 24 },

  // Header
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
    marginBottom: 4,
  },
  cacheNotice: {
    fontSize: 11,
    color: COLORS.yellow,
    marginBottom: 8,
  },
  errorText: {
    color: COLORS.red,
    marginTop: 24,
    textAlign: "center",
  },

  // Sections
  sectionTitle: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 17,
    color: COLORS.darkBackground,
    marginTop: 24,
    marginBottom: 10,
  },

  // Summary grid
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    minWidth: "42%",
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.green,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },

  // Lot status
  statusContainer: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusLabel: { flex: 1, fontSize: 14, color: COLORS.darkBackground },
  statusCount: { fontSize: 14, fontWeight: "600", color: COLORS.darkBackground },

  // Alerts
  alertRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  alertNivel: { fontSize: 14, color: COLORS.darkBackground },
  alertCount: { fontSize: 14, fontWeight: "600", color: COLORS.red },

  // Production
  productionRow: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  productionName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.darkBackground,
    marginBottom: 4,
  },
  productionValues: { flexDirection: "row", gap: 16 },
  productionLabel: { fontSize: 13, color: COLORS.gray },
  productionLabelReal: { fontSize: 13, color: COLORS.green, fontWeight: "600" },
});
