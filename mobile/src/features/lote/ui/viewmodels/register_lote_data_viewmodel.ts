import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import type {
  EtapaLote,
  LoteRouteItem,
} from "../../../../core/navigation/app_navigator";
import { getLoteById } from "../../infrastructure/persistence/lote_mock_repository";

export type RegistroCampo = {
  key: string;
  label: string;
  placeholder: string;
  type: "date" | "number";
};

export type EtapaRegistro = {
  key: EtapaLote;
  label: string;
  fields: RegistroCampo[];
};

export type RegisterLoteDataErrors = Record<string, string>;

export type CalendarMode = "days" | "months";

export type CalendarDay = {
  id: string;
  day: number;
  date: string;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
};

export type CalendarMonthOption = {
  id: string;
  label: string;
  monthIndex: number;
  isSelected: boolean;
};

export type RegistroLotePayload = {
  lote_id: number;
  etapa_id: EtapaLote;
  fecha_inicio: string;
  datos: Record<string, number>;
};

type UseRegisterLoteDataViewModelParams = {
  loteId: number;
  onCancel: () => void;
  onSaved: () => void;
  onNotFound: () => void;
};

const FECHA_INICIO_FIELD: RegistroCampo = {
  key: "fecha_inicio",
  label: "Fecha de inicio",
  placeholder: "Seleccione una fecha de inicio",
  type: "date",
};

export const ETAPAS_REGISTRO: EtapaRegistro[] = [
  {
    key: "preparacion_suelo",
    label: "Preparación del suelo",
    fields: [
      FECHA_INICIO_FIELD,
      {
        key: "fertilizante_aplicado",
        label: "Fertilizante aplicado",
        placeholder: "Ingrese fertilizante aplicado",
        type: "number",
      },
    ],
  },
  {
    key: "siembra",
    label: "Siembra",
    fields: [
      FECHA_INICIO_FIELD,
      {
        key: "frecuencia_riego_mensual",
        label: "Frecuencia de riego mensual",
        placeholder: "Ingrese frecuencia de riego mensual",
        type: "number",
      },
      {
        key: "distancia_plantas",
        label: "Distancia entre plantas",
        placeholder: "Ingrese distancia entre plantas",
        type: "number",
      },
    ],
  },
  {
    key: "desarrollo_vegetativo",
    label: "Desarrollo vegetativo",
    fields: [
      FECHA_INICIO_FIELD,
      {
        key: "frecuencia_riego_mensual",
        label: "Frecuencia de riego mensual",
        placeholder: "Ingrese frecuencia de riego mensual",
        type: "number",
      },
      {
        key: "plantas_totales",
        label: "Plantas totales",
        placeholder: "Ingrese plantas totales",
        type: "number",
      },
      {
        key: "plantas_enfermas",
        label: "Plantas enfermas",
        placeholder: "Ingrese plantas enfermas",
        type: "number",
      },
    ],
  },
  {
    key: "floracion",
    label: "Floración",
    fields: [
      FECHA_INICIO_FIELD,
      {
        key: "frecuencia_riego_mensual",
        label: "Frecuencia de riego mensual",
        placeholder: "Ingrese frecuencia de riego mensual",
        type: "number",
      },
    ],
  },
  {
    key: "fructificacion",
    label: "Fructificación",
    fields: [
      FECHA_INICIO_FIELD,
      {
        key: "frecuencia_riego_mensual",
        label: "Frecuencia de riego mensual",
        placeholder: "Ingrese frecuencia de riego mensual",
        type: "number",
      },
    ],
  },
  {
    key: "cosecha",
    label: "Cosecha",
    fields: [
      FECHA_INICIO_FIELD,
      {
        key: "frecuencia_riego_mensual",
        label: "Frecuencia de riego mensual",
        placeholder: "Ingrese frecuencia de riego mensual",
        type: "number",
      },
      {
        key: "kg_cosechados",
        label: "Kg cosechados",
        placeholder: "Ingrese los kg cosechados",
        type: "number",
      },
      {
        key: "hectareas",
        label: "Hectáreas",
        placeholder: "Ingrese hectáreas",
        type: "number",
      },
    ],
  },
];

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDate(value: string): Date {
  if (!value) {
    return new Date();
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return new Date();
  }

  return new Date(year, month - 1, day);
}

function sanitizeNumber(value: string): string {
  return value.replace(",", ".").replace(/[^0-9.]/g, "");
}

function buildCalendarDays(
  calendarMonth: Date,
  selectedDate: string
): CalendarDay[] {
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  const startOffset = (firstDayOfMonth.getDay() + 6) % 7;
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
  const today = formatDate(new Date());

  return Array.from({ length: totalCells }).map((_, index) => {
    const dayNumber = index - startOffset + 1;
    const cellDate = new Date(year, month, dayNumber);
    const dateString = formatDate(cellDate);
    const isCurrentMonth = cellDate.getMonth() === month;

    return {
      id: `${dateString}-${index}`,
      day: cellDate.getDate(),
      date: dateString,
      isCurrentMonth,
      isSelected: selectedDate === dateString,
      isToday: today === dateString,
    };
  });
}

function validateForm(
  fields: RegistroCampo[],
  values: Record<string, string>
): RegisterLoteDataErrors {
  const newErrors: RegisterLoteDataErrors = {};

  fields.forEach((field) => {
    const value = values[field.key]?.trim() ?? "";

    if (!value) {
      newErrors[field.key] = "Este campo es obligatorio";
      return;
    }

    if (field.type === "number") {
      const numericValue = Number(value);

      if (Number.isNaN(numericValue)) {
        newErrors[field.key] = "Debe ser un número válido";
        return;
      }

      if (numericValue <= 0) {
        newErrors[field.key] = "El valor debe ser mayor que cero";
      }
    }
  });

  const plantasTotales = Number(values.plantas_totales);
  const plantasEnfermas = Number(values.plantas_enfermas);

  if (
    values.plantas_totales &&
    values.plantas_enfermas &&
    !Number.isNaN(plantasTotales) &&
    !Number.isNaN(plantasEnfermas) &&
    plantasEnfermas > plantasTotales
  ) {
    newErrors.plantas_enfermas =
      "Las plantas enfermas no pueden superar las plantas totales";
  }

  return newErrors;
}

export function useRegisterLoteDataViewModel({
  loteId,
  onCancel,
  onSaved,
  onNotFound,
}: UseRegisterLoteDataViewModelParams) {
  const [lote, setLote] = useState<LoteRouteItem | null>(null);
  const [selectedStage, setSelectedStage] =
    useState<EtapaLote>("preparacion_suelo");
  const [showStageSelector, setShowStageSelector] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("days");
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<RegisterLoteDataErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const currentLote = getLoteById(loteId);

      if (!currentLote) {
        onNotFound();
        return;
      }

      const initialDate = parseDate(currentLote.fechaInicio);

      setLote(currentLote);
      setSelectedStage(currentLote.etapa);
      setCalendarMonth(initialDate);
      setValues({
        fecha_inicio: currentLote.fechaInicio,
      });
      setErrors({});
      setHasSubmitted(false);
      setShowStageSelector(false);
      setShowCalendar(false);
      setCalendarMode("days");
    }, [loteId, onNotFound])
  );

  const selectedStageData = useMemo(() => {
    return (
      ETAPAS_REGISTRO.find((item) => item.key === selectedStage) ??
      ETAPAS_REGISTRO[0]
    );
  }, [selectedStage]);

  const shouldShowCosechaWarning = selectedStage === "cosecha";

  const calendarMonthLabel = `${
    MONTH_NAMES[calendarMonth.getMonth()]
  } ${calendarMonth.getFullYear()}`;

  const calendarYear = calendarMonth.getFullYear();

  const calendarDays = useMemo(() => {
    return buildCalendarDays(calendarMonth, values.fecha_inicio ?? "");
  }, [calendarMonth, values.fecha_inicio]);

  const calendarMonthOptions: CalendarMonthOption[] = useMemo(() => {
    return MONTH_NAMES.map((monthName, index) => ({
      id: `${calendarYear}-${index}`,
      label: monthName,
      monthIndex: index,
      isSelected: index === calendarMonth.getMonth(),
    }));
  }, [calendarMonth, calendarYear]);

  const handleToggleStageSelector = () => {
    setShowStageSelector((currentValue) => !currentValue);
    setShowCalendar(false);
    setCalendarMode("days");
  };

  const handleSelectStage = (stage: EtapaLote) => {
    setSelectedStage(stage);
    setShowStageSelector(false);
    setShowCalendar(false);
    setCalendarMode("days");
    setErrors({});
    setHasSubmitted(false);

    setValues((currentValues) => ({
      fecha_inicio: currentValues.fecha_inicio ?? lote?.fechaInicio ?? "",
    }));
  };

  const handleChangeValue = (field: RegistroCampo, value: string) => {
    const cleanValue = field.type === "number" ? sanitizeNumber(value) : value;

    const nextValues = {
      ...values,
      [field.key]: cleanValue,
    };

    setValues(nextValues);

    if (hasSubmitted) {
      setErrors(validateForm(selectedStageData.fields, nextValues));
    }
  };

  const handleToggleCalendar = () => {
    const currentDate = parseDate(values.fecha_inicio ?? "");

    setCalendarMonth(currentDate);
    setCalendarMode("days");
    setShowCalendar((currentValue) => !currentValue);
    setShowStageSelector(false);
  };

  const handleToggleMonthPicker = () => {
    setCalendarMode((currentMode) =>
      currentMode === "days" ? "months" : "days"
    );
  };

  const handlePreviousYear = () => {
    setCalendarMonth((currentMonth) => {
      return new Date(
        currentMonth.getFullYear() - 1,
        currentMonth.getMonth(),
        1
      );
    });
  };

  const handleNextYear = () => {
    setCalendarMonth((currentMonth) => {
      return new Date(
        currentMonth.getFullYear() + 1,
        currentMonth.getMonth(),
        1
      );
    });
  };

  const handleSelectMonth = (monthIndex: number) => {
    setCalendarMonth((currentMonth) => {
      return new Date(currentMonth.getFullYear(), monthIndex, 1);
    });

    setCalendarMode("days");
  };

  const handleSelectDate = (date: string) => {
    const nextValues = {
      ...values,
      fecha_inicio: date,
    };

    setValues(nextValues);
    setShowCalendar(false);
    setCalendarMode("days");

    if (hasSubmitted) {
      setErrors(validateForm(selectedStageData.fields, nextValues));
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleSave = () => {
    if (!lote) {
      onNotFound();
      return;
    }

    setHasSubmitted(true);

    const validationErrors = validateForm(selectedStageData.fields, values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const payload: RegistroLotePayload = {
      lote_id: lote.id,
      etapa_id: selectedStage,
      fecha_inicio: values.fecha_inicio,
      datos: selectedStageData.fields
        .filter((field) => field.key !== "fecha_inicio")
        .reduce<Record<string, number>>((accumulator, field) => {
          accumulator[field.key] = Number(values[field.key]);
          return accumulator;
        }, {}),
    };

    console.log("Registro de etapa:", payload);

    Alert.alert(
      "Datos guardados",
      "Los datos del lote se registraron correctamente."
    );

    onSaved();
  };

  return {
    lote,
    stages: ETAPAS_REGISTRO,
    selectedStage,
    selectedStageData,
    shouldShowCosechaWarning,
    showStageSelector,
    showCalendar,
    calendarMode,
    values,
    errors,
    calendarDays,
    calendarMonthLabel,
    calendarYear,
    calendarMonthOptions,
    handleToggleStageSelector,
    handleSelectStage,
    handleChangeValue,
    handleToggleCalendar,
    handleToggleMonthPicker,
    handlePreviousYear,
    handleNextYear,
    handleSelectMonth,
    handleSelectDate,
    handleCancel,
    handleSave,
  };
}