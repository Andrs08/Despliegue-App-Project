import { useEffect, useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

import type {
  BitacoraRouteItem,
  RootStackParamList,
} from "../../../../core/navigation/app_navigator";
import { DeleteNotesUseCase } from "../../application/delete.-note.use-case";
import { NoteRepository } from "../../infrastructure/persistence/notes.repository";

const notesRepository = new NoteRepository();
const deleteNoteUseCase = new DeleteNotesUseCase(notesRepository);

type AddBitacoraRouteParams = RootStackParamList["AddBitacora"];

type BitacoraErrors = {
  title?: string;
  lot?: string;
  description?: string;
};

type UseAddBitacoraViewModelParams = {
  routeParams?: AddBitacoraRouteParams;
  onCancel: () => void;
  onSaved: () => void;
};

const LOTES = ["Lote 1", "Lote 2", "Lote 3", "Lote 4"];

function validateBitacoraForm(
  currentTitle: string,
  currentLot: string,
  currentDescription: string,
): BitacoraErrors {
  const newErrors: BitacoraErrors = {};

  const cleanTitle = currentTitle.trim();
  const cleanLot = currentLot.trim();
  const cleanDescription = currentDescription.trim();

  if (!cleanTitle) {
    newErrors.title = "El título es obligatorio";
  } else if (cleanTitle.length > 100) {
    newErrors.title = "El título no puede superar los 100 caracteres";
  }

  if (!cleanLot) {
    newErrors.lot = "Debes escoger un lote";
  }

  if (!cleanDescription) {
    newErrors.description = "La descripción es obligatoria";
  }

  return newErrors;
}

export function useAddBitacoraViewModel({
  routeParams,
  onCancel,
  onSaved,
}: UseAddBitacoraViewModelParams) {
  const isEditMode = routeParams?.mode === "edit";
  const currentBitacora: BitacoraRouteItem | null =
    routeParams?.mode === "edit" ? routeParams.bitacora : null;

  const [title, setTitle] = useState("");
  const [lot, setLot] = useState("");
  const [description, setDescription] = useState("");
  const [showLots, setShowLots] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [errors, setErrors] = useState<BitacoraErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  useEffect(() => {
    if (isEditMode && currentBitacora) {
      setTitle(currentBitacora.title);
      setLot(currentBitacora.lot);
      setDescription(currentBitacora.description);
      setSelectedImageUri(currentBitacora.imageUri ?? null);
    } else {
      setTitle("");
      setLot("");
      setDescription("");
      setSelectedImageUri(null);
    }

    setErrors({});
    setHasSubmitted(false);
    setShowLots(false);
  }, [isEditMode, currentBitacora?.id]);

  const handleToggleOptionsMenu = () => {
    setShowOptionsMenu((currentValue) => !currentValue);
  };

  const handleDelete = () => {
    setShowOptionsMenu(false);

    if (
      !routeParams ||
      !("bitacora" in routeParams) ||
      routeParams.mode !== "edit"
    ) {
      return;
    }

    Alert.alert(
      "Eliminar bitácora",
      "¿Estás seguro de que deseas eliminar esta bitácora?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await deleteNoteUseCase.execute(routeParams.bitacora.id);
            onCancel();
          },
        },
      ],
    );
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);

    if (hasSubmitted) {
      setErrors(validateBitacoraForm(value, lot, description));
    }
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);

    if (hasSubmitted) {
      setErrors(validateBitacoraForm(title, lot, value));
    }
  };

  const handleSelectLot = (selectedLot: string) => {
    if (isEditMode) {
      return;
    }

    setLot(selectedLot);
    setShowLots(false);

    if (hasSubmitted) {
      setErrors(validateBitacoraForm(title, selectedLot, description));
    }
  };

  const handleToggleLots = () => {
    if (isEditMode) {
      return;
    }

    setShowLots((currentValue) => !currentValue);
  };

  const handleSelectImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permiso requerido",
        "Debes permitir el acceso a tus fotos para subir una imagen.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedImageUri(result.assets[0].uri);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleSave = () => {
    setHasSubmitted(true);

    const validationErrors = validateBitacoraForm(title, lot, description);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (isEditMode) {
      Alert.alert(
        "Bitácora actualizada",
        "Los cambios de la bitácora se guardaron correctamente.",
      );
    } else {
      Alert.alert("Bitácora guardada", "La bitácora se guardó correctamente.");
    }

    onSaved();
  };

  return {
    lots: LOTES,
    isEditMode,
    title,
    lot,
    description,
    showLots,
    selectedImageUri,
    errors,
    showOptionsMenu,
    handleToggleOptionsMenu,
    handleTitleChange,
    handleDescriptionChange,
    handleSelectLot,
    handleToggleLots,
    handleSelectImage,
    handleCancel,
    handleSave,
    handleDelete,
  };
}
