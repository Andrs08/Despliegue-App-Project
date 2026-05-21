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
import { GravitasOne_400Regular } from "@expo-google-fonts/gravitas-one";
import { MaidenOrange_400Regular } from "@expo-google-fonts/maiden-orange";
import { AlfaSlabOne_400Regular } from "@expo-google-fonts/alfa-slab-one";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../../../core/navigation/app_navigator";
import { AppHeader } from "../../../../shared/ui/app_header";
import { BottomNavigationBar } from "../../../../shared/ui/bottom_navigation_bar";
import {
  CalendarDay,
  RegistroCampo,
  useRegisterLoteDataViewModel,
} from "../viewmodels/register_lote_data_viewmodel";

type RegisterLoteDataRouteProp = RouteProp<
  RootStackParamList,
  "RegisterLoteData"
>;

const WEEK_DAYS = ["L", "M", "M", "J", "V", "S", "D"];

export function RegisterLoteDataPage() {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = height < 700;
  const horizontalPadding = width < 360 ? 24 : width < 400 ? 32 : 42;
  const headerHeight = Math.min(Math.max(height * 0.17, 105), 140);
  const cardPaddingTop = isSmallPhone ? 26 : 36;
  const titleFontSize = width < 360 ? 32 : 36;

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RegisterLoteDataRouteProp>();

  const {
    lote,
    isLoading,
    isSaving,
    selectedStage,
    selectedStageData,
    visibleFields,
    shouldShowCosechaWarning,
    showCalendar,
    calendarMode,
    values,
    errors,
    calendarDays,
    calendarMonthLabel,
    calendarYear,
    calendarMonthOptions,
    handleChangeValue,
    handleToggleCalendar,
    handleToggleMonthPicker,
    handlePreviousYear,
    handleNextYear,
    handleSelectMonth,
    handleSelectDate,
    handleCancel,
    handleSave,
  } = useRegisterLoteDataViewModel({
    loteId: route.params.loteId,
    onCancel: () => {
      navigation.goBack();
    },
    onSaved: () => {
      navigation.navigate("DetailLote", {
        loteId: route.params.loteId,
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

  const renderCalendar = () => (
    <View style={styles.calendarBox}>
      {calendarMode === "days" ? (
        <>
          <TouchableOpacity
            style={styles.calendarMonthButton}
            activeOpacity={0.75}
            onPress={handleToggleMonthPicker}
          >
            <Text style={styles.calendarMonthText}>{calendarMonthLabel}</Text>
            <Ionicons name="chevron-down" size={16} color={COLORS.green} />
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
              <Ionicons name="chevron-back" size={18} color={COLORS.green} />
            </TouchableOpacity>

            <Text style={styles.calendarYearText}>{calendarYear}</Text>

            <TouchableOpacity
              style={styles.calendarArrowButton}
              activeOpacity={0.7}
              onPress={handleNextYear}
            >
              <Ionicons name="chevron-forward" size={18} color={COLORS.green} />
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

  const renderField = (field: RegistroCampo) => {
    const isDateField = field.type === "date";

    if (isDateField) {
      return (
        <View
          key={field.key}
          style={[
            styles.fieldGroup,
            styles.dateFieldGroup,
            showCalendar ? styles.dateFieldGroupOpen : null,
          ]}
        >
          <TouchableOpacity
            style={[
              styles.inputContainer,
              errors[field.key] ? styles.inputError : null,
            ]}
            activeOpacity={0.8}
            onPress={handleToggleCalendar}
          >
            <Text
              style={[
                styles.dateText,
                values[field.key] ? styles.inputText : styles.placeholderText,
              ]}
            >
              {values[field.key] || field.placeholder}
            </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleToggleCalendar}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="calendar-outline"
                size={18}
                color={COLORS.green}
              />
            </TouchableOpacity>
          </TouchableOpacity>

          {showCalendar ? renderCalendar() : null}

          {errors[field.key] ? (
            <Text style={styles.errorText}>{errors[field.key]}</Text>
          ) : null}
        </View>
      );
    }

    return (
      <View key={field.key} style={styles.fieldGroup}>
        <View
          style={[
            styles.inputContainer,
            errors[field.key] ? styles.inputError : null,
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder={field.placeholder}
            placeholderTextColor={COLORS.gray}
            keyboardType="decimal-pad"
            value={values[field.key] ?? ""}
            onChangeText={(text) => handleChangeValue(field, text)}
          />
        </View>

        {errors[field.key] ? (
          <Text style={styles.errorText}>{errors[field.key]}</Text>
        ) : null}
      </View>
    );
  };

  if (isLoading || !lote) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <ActivityIndicator size="large" color={COLORS.green} />
          <Text style={styles.notFoundText}>Cargando lote...</Text>
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
                  styles.screenTitle,
                  { fontSize: titleFontSize, lineHeight: titleFontSize + 4 },
                ]}
              >
                {lote.nombre}
              </Text>

              <Text style={styles.subtitle}>Registra los datos de tu lote</Text>

              <View style={styles.stageDisplay}>
                <Text style={styles.stageDisplayText}>
                  {selectedStageData.label}
                </Text>
                <Ionicons name="lock-closed-outline" size={16} color={COLORS.gray} />
              </View>

              {shouldShowCosechaWarning ? (
                <View style={styles.warningRow}>
                  <Ionicons
                    name="warning-outline"
                    size={18}
                    color={COLORS.pink}
                  />
                  <Text style={styles.warningText}>
                    Ten en cuenta que para esta etapa ya debe estar finalizada
                  </Text>
                </View>
              ) : null}

              <View style={styles.formCard}>
                <Text style={styles.formTitle}>{selectedStageData.label}</Text>

                {visibleFields.map(renderField)}
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  activeOpacity={0.8}
                  onPress={handleCancel}
                  disabled={isSaving}
                >
                  <Text style={styles.cancelButtonText}>cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    isSaving ? styles.saveButtonDisabled : null,
                  ]}
                  activeOpacity={0.8}
                  onPress={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color={COLORS.background} />
                  ) : (
                    <Ionicons
                      name="save-outline"
                      size={15}
                      color={COLORS.background}
                    />
                  )}
                  <Text style={styles.saveButtonText}>
                    {isSaving ? "Guardando..." : "Guardar datos"}
                  </Text>
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

const COLORS = {
  green: "#5D7B3D",
  background: "#FFFFF1",
  gray: "#959595",
  black: "#000000",
  pink: "#E4568B",
  yellow: "#F6C94D",
  error: "#C94C4C",
  softGreen: "rgba(93, 123, 61, 0.08)",
  disabledGreen: "rgba(93, 123, 61, 0.15)",
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
  screenTitle: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.green,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 14,
    lineHeight: 17,
    color: COLORS.gray,
    marginBottom: 22,
  },
  stageDisplay: {
    width: "100%",
    minHeight: 42,
    borderWidth: 1,
    borderColor: COLORS.disabledGreen,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.softGreen,
    marginBottom: 16,
  },
  stageDisplayText: {
    flex: 1,
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 14,
    lineHeight: 18,
    color: COLORS.green,
    paddingRight: 8,
  },
  warningRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
    paddingRight: 8,
  },
  warningText: {
    flex: 1,
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 13,
    lineHeight: 16,
    color: COLORS.gray,
    marginLeft: 8,
  },
  formCard: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: COLORS.background,
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 16,
    marginBottom: 70,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 4,
    overflow: "visible",
    zIndex: 10,
  },
  formTitle: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.green,
    fontSize: 28,
    lineHeight: 32,
    marginBottom: 12,
  },
  fieldGroup: {
    marginBottom: 10,
    position: "relative",
    zIndex: 1,
  },
  dateFieldGroup: {
    zIndex: 50,
    elevation: 50,
  },
  dateFieldGroupOpen: {
    zIndex: 100,
    elevation: 100,
  },
  inputContainer: {
    width: "100%",
    minHeight: 40,
    borderWidth: 1,
    borderColor: COLORS.green,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 13,
    lineHeight: 17,
    color: COLORS.black,
    paddingVertical: 0,
  },
  dateText: {
    flex: 1,
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 13,
    lineHeight: 17,
    paddingRight: 8,
  },
  inputText: {
    color: COLORS.black,
  },
  placeholderText: {
    color: COLORS.gray,
  },
  errorText: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.error,
    fontSize: 12,
    lineHeight: 15,
    marginTop: 4,
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
    shadowOffset: { width: 0, height: 3 },
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
    paddingHorizontal: 22,
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontFamily: "AlfaSlabOne_400Regular",
    color: COLORS.background,
    fontSize: 12,
    lineHeight: 17,
    marginLeft: 6,
  },
  notFoundContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  notFoundText: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.green,
    fontSize: 18,
  },
});