import React from "react";
import {
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
import { GravitasOne_400Regular } from "@expo-google-fonts/gravitas-one";
import { MaidenOrange_400Regular } from "@expo-google-fonts/maiden-orange";
import { AlfaSlabOne_400Regular } from "@expo-google-fonts/alfa-slab-one";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type {
  EtapaLote,
  RootStackParamList,
} from "../../../../core/navigation/app_navigator";
import { AppHeader } from "../../../../shared/ui/app_header";
import { BottomNavigationBar } from "../../../../shared/ui/bottom_navigation_bar";
import {
  CalendarDay,
  useLoteFormViewModel,
} from "../viewmodels/lote_form_viewmodel";

type LoteFormRouteProp = RouteProp<RootStackParamList, "LoteForm">;

const WEEK_DAYS = ["L", "M", "M", "J", "V", "S", "D"];

export function LoteFormPage() {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = height < 700;
  const horizontalPadding = width < 360 ? 24 : width < 400 ? 32 : 42;
  const headerHeight = Math.min(Math.max(height * 0.17, 105), 140);
  const cardPaddingTop = isSmallPhone ? 28 : 42;
  const titleFontSize = width < 360 ? 34 : 38;

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<LoteFormRouteProp>();

  const {
    isEditMode,
    values,
    errors,
    stages,
    selectedStageLabel,
    showStageSelector,
    showCalendar,
    calendarMode,
    calendarDays,
    calendarMonthLabel,
    calendarYear,
    calendarMonthOptions,
    screenTitle,
    screenSubtitle,
    saveButtonLabel,
    handleChangeValue,
    handleToggleStageSelector,
    handleSelectStage,
    handleToggleCalendar,
    handleToggleMonthPicker,
    handlePreviousYear,
    handleNextYear,
    handleSelectMonth,
    handleSelectDate,
    handleCancel,
    handleSave,
  } = useLoteFormViewModel({
    routeParams: route.params,
    onCancel: () => {
      if (route.params.mode === "edit") {
        navigation.navigate("DetailLote", {
          loteId: route.params.loteId,
        });
        return;
      }

      navigation.navigate("Lots");
    },
    onSaved: (loteId: number) => {
      navigation.navigate("DetailLote", {
        loteId,
      });
    },
    onNotFound: () => {
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

  const renderCalendarDay = (dayItem: CalendarDay) => {
    if (!dayItem.isCurrentMonth) {
      return <View key={dayItem.id} style={styles.calendarDayCell} />;
    }

    return (
      <TouchableOpacity
        key={dayItem.id}
        style={[
          styles.calendarDayCell,
          dayItem.isToday ? styles.calendarDayToday : null,
          dayItem.isSelected ? styles.calendarDaySelected : null,
        ]}
        activeOpacity={0.75}
        onPress={() => handleSelectDate(dayItem.date)}
      >
        <Text
          style={[
            styles.calendarDayText,
            dayItem.isSelected ? styles.calendarDayTextSelected : null,
          ]}
        >
          {dayItem.day}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCalendar = () => {
    return (
      <View style={styles.calendarBox}>
        {calendarMode === "days" ? (
          <>
            <TouchableOpacity
              style={styles.calendarMonthButton}
              activeOpacity={0.75}
              onPress={handleToggleMonthPicker}
            >
              <Text style={styles.calendarMonthText}>{calendarMonthLabel}</Text>

              <Ionicons
                name="chevron-down"
                size={16}
                color={COLORS.green}
              />
            </TouchableOpacity>

            <View style={styles.weekDaysRow}>
              {WEEK_DAYS.map((day, index) => (
                <Text key={`${day}-${index}`} style={styles.weekDayText}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {calendarDays.map(renderCalendarDay)}
            </View>
          </>
        ) : (
          <>
            <View style={styles.calendarYearHeader}>
              <TouchableOpacity
                style={styles.calendarArrowButton}
                activeOpacity={0.7}
                onPress={handlePreviousYear}
              >
                <Ionicons
                  name="chevron-back"
                  size={18}
                  color={COLORS.green}
                />
              </TouchableOpacity>

              <Text style={styles.calendarYearText}>{calendarYear}</Text>

              <TouchableOpacity
                style={styles.calendarArrowButton}
                activeOpacity={0.7}
                onPress={handleNextYear}
              >
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={COLORS.green}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.monthsGrid}>
              {calendarMonthOptions.map((month) => (
                <TouchableOpacity
                  key={month.id}
                  style={[
                    styles.monthCell,
                    month.isSelected ? styles.monthCellSelected : null,
                  ]}
                  activeOpacity={0.75}
                  onPress={() => handleSelectMonth(month.monthIndex)}
                >
                  <Text
                    style={[
                      styles.monthCellText,
                      month.isSelected ? styles.monthCellTextSelected : null,
                    ]}
                  >
                    {month.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </View>
    );
  };

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
              keyboardShouldPersistTaps="handled"
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
                {screenTitle}
              </Text>

              <Text style={styles.subtitle}>{screenSubtitle}</Text>

              <View style={styles.formCard}>
                <FormInput
                  label="Nombre del lote"
                  placeholder="Nombre del lote"
                  value={values.nombre}
                  error={errors.nombre}
                  onChangeText={(text) => handleChangeValue("nombre", text)}
                />

                <FormInput
                  label="Hectáreas"
                  placeholder="Hectáreas"
                  value={values.hectareas}
                  error={errors.hectareas}
                  keyboardType="decimal-pad"
                  onChangeText={(text) => handleChangeValue("hectareas", text)}
                />

                <FormInput
                  label="Temperatura mínima"
                  placeholder="Temperatura mínima"
                  value={values.temperaturaMinima}
                  error={errors.temperaturaMinima}
                  keyboardType="decimal-pad"
                  onChangeText={(text) =>
                    handleChangeValue("temperaturaMinima", text)
                  }
                />

                <FormInput
                  label="Temperatura máxima"
                  placeholder="Temperatura máxima"
                  value={values.temperaturaMaxima}
                  error={errors.temperaturaMaxima}
                  keyboardType="decimal-pad"
                  onChangeText={(text) =>
                    handleChangeValue("temperaturaMaxima", text)
                  }
                />

                <Text style={styles.fieldLabel}>Etapa</Text>

                <TouchableOpacity
                  style={[
                    styles.selectContainer,
                    errors.etapa ? styles.inputError : null,
                  ]}
                  activeOpacity={0.8}
                  onPress={handleToggleStageSelector}
                >
                  <Text
                    style={[
                      styles.selectText,
                      selectedStageLabel
                        ? styles.inputText
                        : styles.placeholderText,
                    ]}
                  >
                    {selectedStageLabel || "Selecciona una etapa"}
                  </Text>

                  <Ionicons
                    name={showStageSelector ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={COLORS.green}
                  />
                </TouchableOpacity>

                {errors.etapa ? (
                  <Text style={styles.errorText}>{errors.etapa}</Text>
                ) : null}

                {showStageSelector ? (
                  <View style={styles.dropdown}>
                    {stages.map((stage) => (
                      <TouchableOpacity
                        key={stage.key}
                        style={[
                          styles.dropdownItem,
                          values.etapa === stage.key
                            ? styles.dropdownItemActive
                            : null,
                        ]}
                        activeOpacity={0.8}
                        onPress={() => handleSelectStage(stage.key as EtapaLote)}
                      >
                        <Text
                          style={[
                            styles.dropdownText,
                            values.etapa === stage.key
                              ? styles.dropdownTextActive
                              : null,
                          ]}
                        >
                          {stage.label}
                        </Text>

                        {values.etapa === stage.key ? (
                          <Ionicons
                            name="checkmark"
                            size={17}
                            color={COLORS.green}
                          />
                        ) : null}
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}

                <Text style={styles.fieldLabel}>Fecha de inicio</Text>

                <View
                  style={[
                    styles.dateFieldGroup,
                    showCalendar ? styles.dateFieldGroupOpen : null,
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.selectContainer,
                      errors.fechaInicio ? styles.inputError : null,
                    ]}
                    activeOpacity={0.8}
                    onPress={handleToggleCalendar}
                  >
                    <Text
                      style={[
                        styles.selectText,
                        values.fechaInicio
                          ? styles.inputText
                          : styles.placeholderText,
                      ]}
                    >
                      {values.fechaInicio || "Selecciona la fecha"}
                    </Text>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={handleToggleCalendar}
                      hitSlop={{
                        top: 10,
                        bottom: 10,
                        left: 10,
                        right: 10,
                      }}
                    >
                      <Ionicons
                        name="calendar-outline"
                        size={18}
                        color={COLORS.green}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>

                  {showCalendar ? renderCalendar() : null}
                </View>

                {errors.fechaInicio ? (
                  <Text style={styles.errorText}>{errors.fechaInicio}</Text>
                ) : null}

                <FormInput
                  label="Número de plantas estimadas"
                  placeholder="Número de plantas estimadas"
                  value={values.numeroPlantas}
                  error={errors.numeroPlantas}
                  keyboardType="number-pad"
                  onChangeText={(text) =>
                    handleChangeValue("numeroPlantas", text)
                  }
                />
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  activeOpacity={0.8}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelButtonText}>cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveButton}
                  activeOpacity={0.8}
                  onPress={handleSave}
                >
                  <Ionicons
                    name={isEditMode ? "create-outline" : "save-outline"}
                    size={15}
                    color={COLORS.background}
                  />

                  <Text style={styles.saveButtonText}>{saveButtonLabel}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          <BottomNavigationBar activeRoute="Lots" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type FormInputProps = {
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  keyboardType?: "default" | "decimal-pad" | "number-pad";
  onChangeText: (text: string) => void;
};

function FormInput({
  label,
  placeholder,
  value,
  error,
  keyboardType = "default",
  onChangeText,
}: FormInputProps) {
  return (
    <>
      <Text style={styles.fieldLabel}>{label}</Text>

      <View style={[styles.inputContainer, error ? styles.inputError : null]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray}
          value={value}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </>
  );
}

const COLORS = {
  green: "#5D7B3D",
  background: "#FFFFF1",
  gray: "#959595",
  black: "#000000",
  pink: "#E4568B",
  yellow: "#F6C94D",
  error: "#C94C4C",
  softGreen: "rgba(93, 123, 61, 0.08)",
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
    overflow: "visible",
  },
  content: {
    flexGrow: 1,
    paddingBottom: 180,
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
    marginBottom: 28,
  },
  formCard: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 70,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.14,
    shadowRadius: 4,
    elevation: 3,
    overflow: "visible",
    zIndex: 10,
  },
  fieldLabel: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.green,
    fontSize: 15,
    lineHeight: 18,
    marginBottom: 5,
    marginLeft: 2,
  },
  inputContainer: {
    width: "100%",
    minHeight: 42,
    borderWidth: 1,
    borderColor: COLORS.green,
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: COLORS.background,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  input: {
    width: "100%",
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 14,
    lineHeight: 18,
    color: COLORS.black,
    paddingVertical: 0,
  },
  selectContainer: {
    width: "100%",
    minHeight: 42,
    borderWidth: 1,
    borderColor: COLORS.green,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.background,
  },
  selectText: {
    flex: 1,
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 14,
    lineHeight: 18,
    paddingRight: 8,
  },
  inputText: {
    color: COLORS.black,
  },
  placeholderText: {
    color: COLORS.gray,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "rgba(93, 123, 61, 0.22)",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
    backgroundColor: COLORS.background,
  },
  dropdownItem: {
    minHeight: 38,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(93, 123, 61, 0.12)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownItemActive: {
    backgroundColor: COLORS.softGreen,
  },
  dropdownText: {
    flex: 1,
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 14,
    color: COLORS.green,
    paddingRight: 8,
  },
  dropdownTextActive: {
    color: COLORS.green,
  },
  dateFieldGroup: {
    position: "relative",
    zIndex: 50,
    elevation: 50,
  },
  dateFieldGroupOpen: {
    zIndex: 100,
    elevation: 100,
  },
  errorText: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.error,
    fontSize: 12,
    lineHeight: 15,
    marginTop: -5,
    marginBottom: 8,
    marginLeft: 4,
  },
  calendarBox: {
    position: "absolute",
    top: 48,
    left: 0,
    right: 0,
    zIndex: 999,
    elevation: 999,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(93, 123, 61, 0.28)",
    borderRadius: 10,
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 5,
  },
  calendarMonthButton: {
    alignSelf: "center",
    minHeight: 30,
    paddingHorizontal: 12,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  calendarMonthText: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.green,
    fontSize: 17,
    lineHeight: 20,
    textAlign: "center",
    marginRight: 4,
  },
  calendarYearHeader: {
    width: "100%",
    minHeight: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  calendarYearText: {
    flex: 1,
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.green,
    fontSize: 20,
    lineHeight: 24,
    textAlign: "center",
  },
  calendarArrowButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  weekDaysRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  weekDayText: {
    width: `${100 / 7}%`,
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.gray,
    fontSize: 12,
    lineHeight: 15,
    textAlign: "center",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarDayCell: {
    width: `${100 / 7}%`,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    marginVertical: 1,
  },
  calendarDayToday: {
    borderWidth: 1,
    borderColor: COLORS.yellow,
  },
  calendarDaySelected: {
    backgroundColor: COLORS.green,
  },
  calendarDayText: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.black,
    fontSize: 13,
    lineHeight: 16,
  },
  calendarDayTextSelected: {
    color: COLORS.background,
  },
  monthsGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  monthCell: {
    width: "33.333%",
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 2,
  },
  monthCellSelected: {
    backgroundColor: COLORS.green,
  },
  monthCellText: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.green,
    fontSize: 14,
    lineHeight: 17,
  },
  monthCellTextSelected: {
    color: COLORS.background,
  },
  buttonsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  cancelButton: {
    borderWidth: 1.5,
    borderColor: COLORS.pink,
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    marginRight: 20,
  },
  cancelButtonText: {
    fontFamily: "AlfaSlabOne_400Regular",
    color: COLORS.pink,
    fontSize: 12,
    lineHeight: 17,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.pink,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
  },
  saveButtonText: {
    fontFamily: "AlfaSlabOne_400Regular",
    color: COLORS.background,
    fontSize: 12,
    lineHeight: 17,
    marginLeft: 6,
  },
});