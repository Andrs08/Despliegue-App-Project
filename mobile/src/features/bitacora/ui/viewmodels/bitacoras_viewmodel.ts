import { useEffect, useMemo, useState } from "react";

import type { BitacoraRouteItem } from "../../../../core/navigation/app_navigator";
import { GetNotesUseCase } from "../../application/get-notes.use-case";
import { NoteRepository } from "../../infrastructure/persistence/notes.repository";

const notesRepository = new NoteRepository();
const getNoteUseCase = new GetNotesUseCase(notesRepository);

type SortOption = "recent" | "old";

type UseBitacorasViewModelParams = {
  onOpenBitacora: (bitacora: BitacoraRouteItem) => void;
  onAddBitacora: () => void;
};

const LOTES = ["Todos", "Lote 1", "Lote 2", "Lote 3", "Lote 4"];

export function useBitacorasViewModel({
  onOpenBitacora,
  onAddBitacora,
}: UseBitacorasViewModelParams) {
  const [bitacoras, setBitacoras] = useState<BitacoraRouteItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [showMenu, setShowMenu] = useState(false);
  const [showLots, setShowLots] = useState(false);
  const [selectedLot, setSelectedLot] = useState("Todos");
  const [sortOption, setSortOption] = useState<SortOption>("recent");

  const filteredBitacoras = useMemo(() => {
    // 1. Clonamos el arreglo original para evitar mutaciones directas
    let result = [...bitacoras];

    // 2. Filtrado por lote
    if (selectedLot !== "Todos") {
      result = result.filter((b) => b.lot === selectedLot);
    }

    // 3. Ordenamiento seguro mediante strings (Evita bugs de NaN en React Native)
    result.sort((a, b) => {
      // Si las propiedades no existen por seguridad, asignamos strings vacíos
      const dateA = a.createdAt || "";
      const dateB = b.createdAt || "";

      if (sortOption === "recent") {
        // De mayor a menor (Más recientes primero)
        return dateB.localeCompare(dateA);
      } else {
        // De menor a mayor (Más antiguas primero)
        return dateA.localeCompare(dateB);
      }
    });

    return result;
  }, [bitacoras, selectedLot, sortOption]);

  const currentFilterLabel = `${
    selectedLot === "Todos"
      ? "Mostrando todos los lotes"
      : `Mostrando ${selectedLot}`
  } · ${sortOption === "recent" ? "Más recientes" : "Más antiguas"}`;

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const data = await getNoteUseCase.execute();
      setBitacoras(data);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al registrarse";
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleToggleMenu = () => {
    setShowMenu((currentValue) => !currentValue);
  };

  const handleToggleLots = () => {
    setShowLots((currentValue) => !currentValue);
  };

  const handleSelectRecent = () => {
    setSortOption("recent");
    setShowMenu(false);
    setShowLots(false);
  };

  const handleSelectOld = () => {
    setSortOption("old");
    setShowMenu(false);
    setShowLots(false);
  };

  const handleSelectLot = (lot: string) => {
    setSelectedLot(lot);
    setShowMenu(false);
    setShowLots(false);
  };

  const handleOpenBitacora = (bitacora: BitacoraRouteItem) => {
    onOpenBitacora(bitacora);
  };

  const handleAddBitacora = () => {
    onAddBitacora();
  };

  return {
    lots: LOTES,
    isLoading,
    apiError,
    showMenu,
    showLots,
    selectedLot,
    sortOption,
    filteredBitacoras,
    currentFilterLabel,
    handleToggleMenu,
    handleToggleLots,
    handleSelectRecent,
    handleSelectOld,
    handleSelectLot,
    handleOpenBitacora,
    handleAddBitacora,
  };
}
