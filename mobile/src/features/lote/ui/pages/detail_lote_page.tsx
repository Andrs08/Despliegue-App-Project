import React from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { GravitasOne_400Regular } from "@expo-google-fonts/gravitas-one";
import { MaidenOrange_400Regular } from "@expo-google-fonts/maiden-orange";
import { AlfaSlabOne_400Regular } from "@expo-google-fonts/alfa-slab-one";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../../../core/navigation/app_navigator";
import { AppHeader } from "../../../../shared/ui/app_header";
import { BottomNavigationBar } from "../../../../shared/ui/bottom_navigation_bar";
import { useDetailLoteViewModel } from "../viewmodels/detail_lote_viewmodel";

type DetailLoteRouteProp = RouteProp<RootStackParamList, "DetailLote">;

export function DetailLotePage() {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = height < 700;
  const horizontalPadding = width < 360 ? 24 : width < 400 ? 32 : 42;
  const headerHeight = Math.min(Math.max(height * 0.17, 105), 140);
  const cardPaddingTop = isSmallPhone ? 28 : 38;
  const titleFontSize = width < 360 ? 34 : 38;
  const metricNumberFontSize = width < 360 ? 26 : 30;

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<DetailLoteRouteProp>();

  const {
    lote,
    loading,
    error,
    produccionEstimada,
    stages,
    alerts,
    showOptionsMenu,
    currentStageIndex,
    currentStageLabel,
    daysSinceStart,
    handleToggleOptionsMenu,
    handleEditLote,
    handleDeleteLote,
    handleRegisterData,
  } = useDetailLoteViewModel({
    loteId: route.params.loteId,        
    onEditLote: (loteId: string) => {
      navigation.navigate("LoteForm", {
        mode: "edit",
        loteId,
      });
    },
    onRegisterData: (loteId: string) => {
      navigation.navigate("RegisterLoteData", {
        loteId,
      });
    },
    onDeleted: () => {
      navigation.navigate("Lots");
    },
  });

  const [fontsLoaded] = useFonts({
    GravitasOne_400Regular,
    MaidenOrange_400Regular,
    AlfaSlabOne_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  if (loading && !lote) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <ActivityIndicator size="large" color={COLORS.green} />
        </View>
      </SafeAreaView>
    );
  }

  if (error && !lote) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundTitle}>Error al cargar el lote</Text>
          <Text style={{ color: COLORS.gray, marginBottom: 16, textAlign: "center" }}>
            {error}
          </Text>
          <TouchableOpacity
            style={styles.saveButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Lots")}
          >
            <Text style={styles.saveButtonText}>Volver a lotes</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!lote) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundTitle}>Lote no encontrado</Text>
          <TouchableOpacity
            style={styles.saveButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Lots")}
          >
            <Text style={styles.saveButtonText}>Volver a lotes</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
            <Ionicons
              name="ellipsis-vertical"
              size={22}
              color={COLORS.green}
            />
          </TouchableOpacity>

          {showOptionsMenu ? (
            <View style={styles.optionsMenu}>
              <TouchableOpacity
                style={styles.optionsMenuItem}
                activeOpacity={0.75}
                onPress={handleDeleteLote}
              >
                <Text style={styles.deleteOptionText}>Eliminar lote</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionsMenuItem}
                activeOpacity={0.75}
                onPress={handleEditLote}
              >
                <Text style={styles.editOptionText}>Editar lote</Text>
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
                  {
                    fontSize: titleFontSize,
                    lineHeight: titleFontSize + 4,
                  },
                ]}
              >
                {lote.nombre}
              </Text>

              <Text style={styles.subtitle}>Información actual de tu lote</Text>

              {/* ── Métricas ── */}
              <View style={styles.metricsRow}>
                <View style={styles.productionCard}>
                  <Text
                    style={[
                      styles.productionValue,
                      {
                        fontSize: metricNumberFontSize,
                        lineHeight: metricNumberFontSize + 3,
                      },
                    ]}
                  >
                    {produccionEstimada}
                  </Text>

                  <Text style={styles.productionMetricLabel}>
                    Producción{"\n"}estimada
                  </Text>
                </View>

                <View style={styles.statusCard}>
                  <Text
                    style={[
                      styles.statusValue,
                      {
                        fontSize: metricNumberFontSize,
                        lineHeight: metricNumberFontSize + 3,
                      },
                    ]}
                  >
                    {lote.estado}
                  </Text>

                  <Text style={styles.statusMetricLabel}>
                    Estado{"\n"}actual
                  </Text>
                </View>
              </View>

              {/* ── Avance del lote ── */}
              <View style={styles.progressCard}>
                <Text style={styles.progressTitle}>Avance del lote</Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.progressScrollContent}
                >
                  {stages.map((stage, index) => {
                    const isCompleted = index < currentStageIndex;
                    const isCurrent = index === currentStageIndex;
                    const isPending = index > currentStageIndex;

                    return (
                      <View key={stage.key} style={styles.stageStep}>
                        <View style={styles.stageMarkerRow}>
                          <View
                            style={[
                              styles.stageCircle,
                              isCompleted ? styles.stageCircleCompleted : null,
                              isCurrent ? styles.stageCircleCurrent : null,
                              isPending ? styles.stageCirclePending : null,
                            ]}
                          >
                            {isCompleted ? (
                              <Ionicons
                                name="checkmark"
                                size={16}
                                color={COLORS.background}
                              />
                            ) : null}

                            {isCurrent ? (
                              <View style={styles.stageCurrentDot} />
                            ) : null}
                          </View>

                          {index < stages.length - 1 ? (
                            <View
                              style={[
                                styles.stageLine,
                                index < currentStageIndex
                                  ? styles.stageLineCompleted
                                  : styles.stageLinePending,
                              ]}
                            />
                          ) : null}
                        </View>

                        <Text
                          style={[
                            styles.stageStepLabel,
                            isCurrent ? styles.stageStepLabelCurrent : null,
                          ]}
                          numberOfLines={2}
                        >
                          {stage.label}
                        </Text>
                      </View>
                    );
                  })}
                </ScrollView>

                <View style={styles.progressDivider} />

                <View style={styles.progressFooter}>
                  <View style={styles.progressFooterItem}>
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color={COLORS.green}
                    />

                    <Text style={styles.progressFooterText}>
                      {daysSinceStart} días desde el inicio
                    </Text>
                  </View>

                  <Text style={styles.progressFooterText}>
                    Etapa {currentStageIndex + 1} de {stages.length}
                  </Text>
                </View>
              </View>

              {/* ── Alertas activas ── */}
              <View style={styles.alertsTitleRow}>
                <Ionicons
                  name="warning-outline"
                  size={16}
                  color={COLORS.pink}
                />

                <Text style={styles.alertsTitle}>Alertas activas</Text>
              </View>

              {alerts.length === 0 ? (
                <Text
                  style={{
                    fontFamily: "MaidenOrange_400Regular",
                    color: COLORS.gray,
                    fontSize: 13,
                    marginBottom: 12,
                  }}
                >
                  Sin alertas activas
                </Text>
              ) : null}

              {alerts.map((alert) => (
                <View key={alert.id} style={styles.alertCard}>
                  <View style={styles.alertCircle} />

                  <View style={styles.alertTextContainer}>
                    <Text style={styles.alertTitle}>{alert.title}</Text>
                    <Text style={styles.alertDate}>{alert.timeAgo}</Text>
                  </View>
                </View>
              ))}

              {/* ── Etapa actual ── */}
              <View style={styles.currentStageCard}>
                <Text style={styles.currentStageTitle}>Etapa actual</Text>
                <Text style={styles.currentStageText}>{currentStageLabel}</Text>
              </View>

              <TouchableOpacity
                style={styles.registerButton}
                activeOpacity={0.85}
                onPress={handleRegisterData}
              >
                <Text style={styles.registerButtonText}>Registrar datos</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <BottomNavigationBar activeRoute="Lots" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const COLORS = {
  green: "#5D7B3D",
  background: "#FFFFF1",
  gray: "#959595",
  black: "#000000",
  blue: "#4A7DBA",
  softBlue: "#E8F1FB",
  purple: "#933DC8",
  softPurple: "#F7EFFF",
  pink: "#E4568B",
  softPink: "#FDE7EC",
  yellow: "#F6C94D",
  yellowDark: "#D7A923",
  lineGray: "rgba(149, 149, 149, 0.35)",
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
    paddingBottom: 96,
  },
  optionsButton: {
    position: "absolute",
    top: 20,
    right: 16,
    zIndex: 20,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  optionsMenu: {
    position: "absolute",
    top: 52,
    right: 14,
    zIndex: 30,
    width: 112,
    borderRadius: 2,
    backgroundColor: COLORS.background,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden",
  },
  optionsMenuItem: {
    minHeight: 42,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  deleteOptionText: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.pink,
    fontSize: 13,
  },
  editOptionText: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.green,
    fontSize: 13,
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
    marginBottom: 16,
  },
  metricsRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  productionCard: {
    width: 88,
    minHeight: 82,
    borderWidth: 1.2,
    borderColor: COLORS.blue,
    borderRadius: 12,
    backgroundColor: COLORS.softBlue,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 26,
    paddingVertical: 8,
  },
  statusCard: {
    width: 88,
    minHeight: 82,
    borderWidth: 1.2,
    borderColor: COLORS.purple,
    borderRadius: 12,
    backgroundColor: COLORS.softPurple,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  productionValue: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.blue,
    textAlign: "center",
  },
  statusValue: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.purple,
    textAlign: "center",
  },
  productionMetricLabel: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.blue,
    fontSize: 13,
    lineHeight: 15,
    textAlign: "center",
  },
  statusMetricLabel: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.purple,
    fontSize: 13,
    lineHeight: 15,
    textAlign: "center",
  },
  progressCard: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: COLORS.background,
    paddingTop: 14,
    paddingBottom: 12,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 4,
  },
  progressTitle: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 20,
    lineHeight: 24,
    color: COLORS.green,
    marginLeft: 14,
    marginBottom: 10,
  },
  progressScrollContent: {
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
  stageStep: {
    width: 112,
  },
  stageMarkerRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 32,
  },
  stageCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  stageCircleCompleted: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },
  stageCircleCurrent: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.yellow,
  },
  stageCirclePending: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.lineGray,
  },
  stageCurrentDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.yellow,
  },
  stageLine: {
    flex: 1,
    height: 3,
    marginHorizontal: 4,
    borderRadius: 2,
  },
  stageLineCompleted: {
    backgroundColor: COLORS.green,
  },
  stageLinePending: {
    backgroundColor: COLORS.lineGray,
  },
  stageStepLabel: {
    width: 96,
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 12,
    lineHeight: 14,
    color: COLORS.gray,
    marginTop: 4,
  },
  stageStepLabelCurrent: {
    color: COLORS.yellowDark,
  },
  progressDivider: {
    height: 1,
    backgroundColor: "rgba(149, 149, 149, 0.28)",
    marginHorizontal: 14,
    marginTop: 8,
    marginBottom: 9,
  },
  progressFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  progressFooterItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressFooterText: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 13,
    lineHeight: 16,
    color: COLORS.green,
    marginLeft: 5,
  },
  alertsTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },
  alertsTitle: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 18,
    lineHeight: 22,
    color: COLORS.pink,
    marginLeft: 6,
  },
  alertCard: {
    width: "100%",
    minHeight: 62,
    borderRadius: 10,
    backgroundColor: COLORS.softPink,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  alertCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.pink,
    marginRight: 14,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.pink,
    fontSize: 13,
    lineHeight: 15,
  },
  alertDate: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.gray,
    fontSize: 12,
    lineHeight: 14,
  },
  currentStageCard: {
    width: "100%",
    minHeight: 58,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: "rgba(93, 123, 61, 0.16)",
    justifyContent: "center",
    paddingHorizontal: 14,
    marginTop: 4,
    marginBottom: 18,
  },
  currentStageTitle: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.green,
    fontSize: 16,
    lineHeight: 19,
  },
  currentStageText: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.gray,
    fontSize: 13,
    lineHeight: 15,
  },
  registerButton: {
    alignSelf: "center",
    backgroundColor: COLORS.yellow,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 11,
    marginBottom: 10,
  },
  registerButtonText: {
    fontFamily: "AlfaSlabOne_400Regular",
    color: COLORS.background,
    fontSize: 12,
    lineHeight: 17,
  },
  notFoundContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  notFoundTitle: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.green,
    fontSize: 30,
    lineHeight: 34,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: COLORS.pink,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 24,
  },
  saveButtonText: {
    fontFamily: "AlfaSlabOne_400Regular",
    color: COLORS.background,
    fontSize: 12,
    lineHeight: 17,
  },
});