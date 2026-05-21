import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import type { EtapaLote } from "../../domain/entities/lot.entity";
import { GetLoteUseCase } from "../../application/use-cases/get-lot.use-case";
import { CreateLoteUseCase } from "../../application/use-cases/create-lot.use-case";
import { UpdateLoteUseCase } from "../../application/use-cases/update-lot.use-case";
import { G } from "react-native-svg";
import { ApiLoteRepository } from "../../infrastructure/persistence/api_lot.repository";
import { LocalPreferencesAsyncStorage } from "@/src/core/LocalPreferencesAsyncStorage";

const storage = LocalPreferencesAsyncStorage.getInstance();
const repository = new ApiLoteRepository(storage);
const getLoteUseCase = new GetLoteUseCase(repository);
const createLoteUseCase = new CreateLoteUseCase(repository);
const updateLoteUseCase = new UpdateLoteUseCase(repository);

export type LoteFormValues = {
  nombre: string;
  hectareas: string;
  temperaturaMinima: string;
  temperaturaMaxima: string;
  etapa: EtapaLote | "";
  fechaInicio: string;
  numeroPlantas: string;
};
export type LoteFormErrors = Partial<Record<keyof LoteFormValues, string>>;
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

export const ETAPAS_OPTIONS: { key: EtapaLote; label: string }[] = [
  { key: "preparacion_suelo", label: "Preparación del suelo" },
  { key: "siembra", label: "Siembra" },
  { key: "desarrollo_vegetativo", label: "Desarrollo vegetativo" },
  { key: "floracion", label: "Floración" },
  { key: "fructificacion", label: "Fructificación" },
  { key: "cosecha", label: "Cosecha" },
];

const ETAPA_TO_ID: Record<EtapaLote, number> = {
  preparacion_suelo: 1,
  siembra: 2,
  desarrollo_vegetativo: 3,
  floracion: 4,
  fructificacion: 5,
  cosecha: 6,
};

const ID_TO_ETAPA: Record<number, EtapaLote> = {
  1: "preparacion_suelo",
  2: "siembra",
  3: "desarrollo_vegetativo",
  4: "floracion",
  5: "fructificacion",
  6: "cosecha",
};

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

function validateLoteForm(values: LoteFormValues): LoteFormErrors {
  const errors: LoteFormErrors = {};

  const nombre = values.nombre.trim();
  const hectareas = Number(values.hectareas);
  const temperaturaMinima = Number(values.temperaturaMinima);
  const temperaturaMaxima = Number(values.temperaturaMaxima);
  const numeroPlantas = Number(values.numeroPlantas);

  if (!nombre) errors.nombre = "El nombre del lote es obligatorio";

  if (!values.hectareas.trim()) {
    errors.hectareas = "Las hectáreas son obligatorias";
  } else if (Number.isNaN(hectareas) || hectareas <= 0) {
    errors.hectareas = "Ingresa un número válido mayor que cero";
  }

  if (!values.temperaturaMinima.trim()) {
    errors.temperaturaMinima = "La temperatura mínima es obligatoria";
  } else if (Number.isNaN(temperaturaMinima)) {
    errors.temperaturaMinima = "Ingresa una temperatura válida";
  }

  if (!values.temperaturaMaxima.trim()) {
    errors.temperaturaMaxima = "La temperatura máxima es obligatoria";
  } else if (Number.isNaN(temperaturaMaxima)) {
    errors.temperaturaMaxima = "Ingresa una temperatura válida";
  }

  if (
    values.temperaturaMinima.trim() &&
    values.temperaturaMaxima.trim() &&
    !Number.isNaN(temperaturaMinima) &&
    !Number.isNaN(temperaturaMaxima) &&
    temperaturaMinima > temperaturaMaxima
  ) {
    errors.temperaturaMaxima =
      "La temperatura máxima debe ser mayor que la mínima";
  }

  if (!values.etapa) errors.etapa = "Debes seleccionar una etapa";

  if (!values.fechaInicio) {
    errors.fechaInicio = "La fecha de inicio es obligatoria";
  }

  if (!values.numeroPlantas.trim()) {
    errors.numeroPlantas = "El número de plantas es obligatorio";
  } else if (Number.isNaN(numeroPlantas) || numeroPlantas <= 0) {
    errors.numeroPlantas = "Ingresa un número válido mayor que cero";
  }

  return errors;
}

type LoteFormRouteParams =
  | { mode: "create" }
  | { mode: "edit"; loteId: string };

type UseLoteFormViewModelParams = {
  routeParams: LoteFormRouteParams;
  onCancel: () => void;
  onSaved: (loteId: string) => void;
  onNotFound: () => void;
};

const initialValues: LoteFormValues = {
  nombre: "",
  hectareas: "",
  temperaturaMinima: "",
  temperaturaMaxima: "",
  etapa: "",
  fechaInicio: "",
  numeroPlantas: "",
};

export function useLoteFormViewModel({
  routeParams,
  onCancel,
  onSaved,
  onNotFound,
}: UseLoteFormViewModelParams) {
  const isEditMode = routeParams.mode === "edit";
  const loteId = routeParams.mode === "edit" ? routeParams.loteId : null;

  const [values, setValues] = useState<LoteFormValues>(initialValues);
  const [errors, setErrors] = useState<LoteFormErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showStageSelector, setShowStageSelector] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("days");
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  useEffect(() => {
    if (!isEditMode) {
      setValues(initialValues);
      setErrors({});
      setHasSubmitted(false);
      setShowStageSelector(false);
      setShowCalendar(false);
      setCalendarMode("days");
      setCalendarMonth(new Date());
      return;
    }

    if (!loteId) {
      onNotFound();
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const lote = await getLoteUseCase.execute(loteId);

        if (cancelled) return;

        if (!lote) {
          onNotFound();
          return;
        }

        const etapa: EtapaLote | "" = ID_TO_ETAPA[lote.etapaActualId] ?? "";
        const initialDate = parseDate(lote.fechaInicio);

        setValues({
          nombre: lote.nombre,
          hectareas: String(lote.hectareas),
          temperaturaMinima: String(lote.temperaturaMinima),
          temperaturaMaxima: String(lote.temperaturaMaxima),
          etapa,
          fechaInicio: lote.fechaInicio,
          numeroPlantas: String(lote.numeroPlantas),
        });

        setCalendarMonth(initialDate);
        setErrors({});
        setHasSubmitted(false);
        setShowStageSelector(false);
        setShowCalendar(false);
        setCalendarMode("days");
      } catch {
        if (!cancelled) onNotFound();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isEditMode, loteId]);

  const selectedStageLabel =
    ETAPAS_OPTIONS.find((s) => s.key === values.etapa)?.label ?? "";

  const screenTitle = isEditMode ? "Editar lote" : "Agregar lote";
  const screenSubtitle = isEditMode
    ? "Edita tu área de cultivo"
    : "Registra una nueva área de cultivo";
  const saveButtonLabel = isEditMode ? "Actualizar lote" : "Guardar lote";

  const calendarMonthLabel = `${
    MONTH_NAMES[calendarMonth.getMonth()]
  } ${calendarMonth.getFullYear()}`;

  const calendarYear = calendarMonth.getFullYear();

  const calendarDays = useMemo(
    () => buildCalendarDays(calendarMonth, values.fechaInicio),
    [calendarMonth, values.fechaInicio],
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

  const handleChangeValue = (field: keyof LoteFormValues, value: string) => {
    const cleanValue =
      field === "nombre" || field === "fechaInicio" || field === "etapa"
        ? value
        : sanitizeNumber(value);

    const nextValues = { ...values, [field]: cleanValue };
    setValues(nextValues);

    if (hasSubmitted) setErrors(validateLoteForm(nextValues));
  };

  const handleToggleStageSelector = () => {
    setShowStageSelector((v) => !v);
    setShowCalendar(false);
    setCalendarMode("days");
  };

  const handleSelectStage = (stage: EtapaLote) => {
    const nextValues: LoteFormValues = { ...values, etapa: stage };
    setValues(nextValues);
    setShowStageSelector(false);
    if (hasSubmitted) setErrors(validateLoteForm(nextValues));
  };

  const handleToggleCalendar = () => {
    setCalendarMonth(parseDate(values.fechaInicio));
    setCalendarMode("days");
    setShowCalendar((v) => !v);
    setShowStageSelector(false);
  };

  const handleToggleMonthPicker = () => {
    setCalendarMode((m) => (m === "days" ? "months" : "days"));
  };

  const handlePreviousYear = () => {
    setCalendarMonth((m) => new Date(m.getFullYear() - 1, m.getMonth(), 1));
  };

  const handleNextYear = () => {
    setCalendarMonth((m) => new Date(m.getFullYear() + 1, m.getMonth(), 1));
  };

  const handleSelectMonth = (monthIndex: number) => {
    setCalendarMonth((m) => new Date(m.getFullYear(), monthIndex, 1));
    setCalendarMode("days");
  };

  const handleSelectDate = (date: string) => {
    const nextValues: LoteFormValues = { ...values, fechaInicio: date };
    setValues(nextValues);
    setShowCalendar(false);
    setCalendarMode("days");
    if (hasSubmitted) setErrors(validateLoteForm(nextValues));
  };

  const handleCancel = () => onCancel();
  const handleSave = async () => {
    setHasSubmitted(true);

    const validationErrors = validateLoteForm(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;
    setIsSaving(true);

    try {
      if (isEditMode) {
        if (!loteId) {
          onNotFound();
          return;
        }

        const updated = await updateLoteUseCase.execute(loteId, {
          nombre: values.nombre.trim(),
          hectareas: Number(values.hectareas),
          temperatura_min: Number(values.temperaturaMinima),
          temperatura_max: Number(values.temperaturaMaxima),
          numero_plantas: Number(values.numeroPlantas),
        });

        Alert.alert(
          "Lote actualizado",
          "Los cambios se guardaron correctamente.",
        );
        onSaved(updated.id);
      } else {
        const etapaId = ETAPA_TO_ID[values.etapa as EtapaLote];
        const created = await createLoteUseCase.execute({
          nombre: values.nombre.trim(),
          hectareas: Number(values.hectareas),
          temperatura_min: Number(values.temperaturaMinima),
          temperatura_max: Number(values.temperaturaMaxima),
          etapa_actual_id: etapaId,
          fecha_inicio: values.fechaInicio,
          numero_plantas: Number(values.numeroPlantas),
        });

        Alert.alert("Lote guardado", "El lote se creó correctamente.");
        onSaved(created.id);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ocurrió un error inesperado";
      Alert.alert("Error", message);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isEditMode,
    isSaving,
    values,
    errors,
    stages: ETAPAS_OPTIONS,
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
  };
}
