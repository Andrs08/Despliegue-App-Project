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
    const filtered =
      selectedLot === "Todos"
        ? bitacoras
        : bitacoras.filter((item) => item.lot === selectedLot);

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      if (sortOption === "recent") {
        return dateB - dateA;
      }

      return dateA - dateB;
    });
  }, [selectedLot, sortOption]);

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
