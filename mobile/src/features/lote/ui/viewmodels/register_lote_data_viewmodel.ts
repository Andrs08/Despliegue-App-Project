import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import type { EtapaLote } from "../../domain/entities/lot.entity";
import type { Lote } from "../../domain/entities/lot.entity";

import { GetLoteUseCase } from "../../application/use-cases/get-lot.use-case";
import { ApiLoteRepository } from "../../infrastructure/persistence/api_lot.repository";
import { ApiStageRecordRepository } from "../../infrastructure/persistence/api_stage-record.repository";
import { LocalPreferencesAsyncStorage } from "../../../../core/LocalPreferencesAsyncStorage";

const storage = LocalPreferencesAsyncStorage.getInstance();
const loteRepo = new ApiLoteRepository(storage);
const stageRecordRepo = new ApiStageRecordRepository(storage);

const getLoteUseCase = new GetLoteUseCase(loteRepo);

export const ETAPA_TO_ID: Record<EtapaLote, number> = {
  preparacion_suelo: 1,
  siembra: 2,
  desarrollo_vegetativo: 3,
  floracion: 4,
  fructificacion: 5,
  cosecha: 6,
};

export const ID_TO_ETAPA: Record<number, EtapaLote> = {
  1: "preparacion_suelo",
  2: "siembra",
  3: "desarrollo_vegetativo",
  4: "floracion",
  5: "fructificacion",
  6: "cosecha",
};

export type RegistroCampo = {
  key: string;
  label: string;
  placeholder: string;
  type: "date" | "number";
  hiddenFromLote?: boolean;
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

type UseRegisterLoteDataViewModelParams = {
  loteId: string;
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
        placeholder: "Ingrese fertilizante aplicado (kg)",
        type: "number",
      },
      {
        key: "plantas_totales",
        label: "Plantas totales",
        placeholder: "Ingrese plantas totales",
        type: "number",
        hiddenFromLote: true,
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
        label: "Distancia entre plantas (m)",
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
        hiddenFromLote: true,
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
        hiddenFromLote: true,
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
  if (!value) return new Date();
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return new Date();
  return new Date(year, month - 1, day);
}

function sanitizeNumber(value: string): string {
  return value.replace(",", ".").replace(/[^0-9.]/g, "");
}

function buildCalendarDays(
  calendarMonth: Date,
  selectedDate: string,
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
  visibleFields: RegistroCampo[],
  values: Record<string, string>,
): RegisterLoteDataErrors {
  const newErrors: RegisterLoteDataErrors = {};

  visibleFields.forEach((field) => {
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
  const [lote, setLote] = useState<Lote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedStage, setSelectedStage] =
    useState<EtapaLote>("preparacion_suelo");

  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("days");
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<RegisterLoteDataErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      async function load() {
        setIsLoading(true);

        try {
          const currentLote = await getLoteUseCase.execute(loteId);

          if (cancelled) return;

          if (!currentLote) {
            onNotFound();
            return;
          }

          const etapa =
            ID_TO_ETAPA[currentLote.etapaActualId] ?? "preparacion_suelo";
          const initialDate = parseDate(currentLote.fechaInicio);

          setLote(currentLote);
          setSelectedStage(etapa);
          setCalendarMonth(initialDate);

          setValues(buildInitialValues(etapa, currentLote));
          setErrors({});
          setHasSubmitted(false);
          setShowCalendar(false);
          setCalendarMode("days");
        } catch {
          if (!cancelled) onNotFound();
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      }

      load();

      return () => {
        cancelled = true;
      };
    }, [loteId, onNotFound]),
  );

  const selectedStageData = useMemo(
    () =>
      ETAPAS_REGISTRO.find((item) => item.key === selectedStage) ??
      ETAPAS_REGISTRO[0],
    [selectedStage],
  );

  const visibleFields = useMemo(
    () => selectedStageData.fields.filter((f) => !f.hiddenFromLote),
    [selectedStageData],
  );

  const shouldShowCosechaWarning = selectedStage === "cosecha";

  const calendarMonthLabel = `${
    MONTH_NAMES[calendarMonth.getMonth()]
  } ${calendarMonth.getFullYear()}`;

  const calendarYear = calendarMonth.getFullYear();

  const calendarDays = useMemo(
    () => buildCalendarDays(calendarMonth, values.fecha_inicio ?? ""),
    [calendarMonth, values.fecha_inicio],
  );

  const calendarMonthOptions: CalendarMonthOption[] = useMemo(
    () =>
      MONTH_NAMES.map((monthName, index) => ({
        id: `${calendarYear}-${index}`,
        label: monthName,
        monthIndex: index,
        isSelected: index === calendarMonth.getMonth(),
      })),
    [calendarMonth, calendarYear],
  );

  const handleChangeValue = (field: RegistroCampo, value: string) => {
    const cleanValue = field.type === "number" ? sanitizeNumber(value) : value;

    const nextValues = { ...values, [field.key]: cleanValue };
    setValues(nextValues);

    if (hasSubmitted) {
      setErrors(validateForm(visibleFields, nextValues));
    }
  };

  const handleToggleCalendar = () => {
    const currentDate = parseDate(values.fecha_inicio ?? "");
    setCalendarMonth(currentDate);
    setCalendarMode("days");
    setShowCalendar((v) => !v);
  };

  const handleToggleMonthPicker = () => {
    setCalendarMode((m) => (m === "days" ? "months" : "days"));
  };

  const handlePreviousYear = () => {
    setCalendarMonth((d) => new Date(d.getFullYear() - 1, d.getMonth(), 1));
  };

  const handleNextYear = () => {
    setCalendarMonth((d) => new Date(d.getFullYear() + 1, d.getMonth(), 1));
  };

  const handleSelectMonth = (monthIndex: number) => {
    setCalendarMonth((d) => new Date(d.getFullYear(), monthIndex, 1));
    setCalendarMode("days");
  };

  const handleSelectDate = (date: string) => {
    const nextValues = { ...values, fecha_inicio: date };
    setValues(nextValues);
    setShowCalendar(false);
    setCalendarMode("days");

    if (hasSubmitted) {
      setErrors(validateForm(visibleFields, nextValues));
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleSave = async () => {
    if (!lote) {
      onNotFound();
      return;
    }

    setHasSubmitted(true);

    const validationErrors = validateForm(visibleFields, values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const datos = selectedStageData.fields
      .filter((f) => f.key !== "fecha_inicio")
      .reduce<Record<string, number>>((acc, field) => {
        acc[field.key] = Number(values[field.key] ?? 0);
        return acc;
      }, {});

    setIsSaving(true);

    try {
      await stageRecordRepo.create({
        lote_id: lote.id,
        etapa_id: ETAPA_TO_ID[selectedStage],
        datos,
        fecha: values.fecha_inicio,
      });

      Alert.alert(
        "Datos guardados",
        "Los datos del lote se registraron correctamente.",
      );

      onSaved();
    } catch (error) {
      Alert.alert(
        "Error al guardar",
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado. Intente de nuevo.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
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
  };
}

function buildInitialValues(
  etapa: EtapaLote,
  lote: Lote,
): Record<string, string> {
  const initial: Record<string, string> = {
    fecha_inicio: lote.fechaInicio,
  };

  if (etapa === "desarrollo_vegetativo" || etapa === "preparacion_suelo") {
    initial.plantas_totales = String(lote.numeroPlantas);
  }

  if (etapa === "cosecha") {
    initial.hectareas = String(lote.hectareas);
  }

  return initial;
}
