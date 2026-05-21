import { useEffect, useMemo, useState } from "react";

import type { BitacoraRouteItem } from "../../../../core/navigation/app_navigator";
import { GetNotesUseCase } from "../../application/get-notes.use-case";
import { NoteRepository } from "../../infrastructure/persistence/notes.repository";
import { GetLotesUseCase } from "@/src/features/lote/application/use-cases/get-lots.use-case";
import { ApiLoteRepository } from "@/src/features/lote/infrastructure/persistence/api_lot.repository";
import { LocalPreferencesAsyncStorage } from "@/src/core/LocalPreferencesAsyncStorage";
import { Lote } from "@/src/features/lote/domain/entities/lot.entity";

const notesRepository = new NoteRepository();
const getNoteUseCase = new GetNotesUseCase(notesRepository);

const localPrefs = LocalPreferencesAsyncStorage.getInstance();
const loteRepository = new ApiLoteRepository(localPrefs);
const getLotesUseCase = new GetLotesUseCase(loteRepository);

type SortOption = "recent" | "old";

type UseBitacorasViewModelParams = {
  onOpenBitacora: (bitacora: BitacoraRouteItem) => void;
  onAddBitacora: () => void;
};

export function useBitacorasViewModel({
  onOpenBitacora,
  onAddBitacora,
}: UseBitacorasViewModelParams) {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [bitacoras, setBitacoras] = useState<BitacoraRouteItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [showMenu, setShowMenu] = useState(false);
  const [showLots, setShowLots] = useState(false);
  const [selectedLot, setSelectedLot] = useState("Todos");
  const [sortOption, setSortOption] = useState<SortOption>("recent");

  const mappedBitacoras = useMemo(() => {
    return bitacoras.map((bitacora) => {
      const loteEncontrado = lotes.find((l) => l.id === bitacora.lot);

      return {
        ...bitacora,
        lot: loteEncontrado ? loteEncontrado.nombre : bitacora.lot,
      };
    });
  }, [bitacoras, lotes]);

  const filteredBitacoras = useMemo(() => {
    let result = [...mappedBitacoras];

    if (selectedLot !== "Todos") {
      result = result.filter((b) => b.lot === selectedLot);
    }

    result.sort((a, b) => {
      const dateA = a.createdAt || "";
      const dateB = b.createdAt || "";

      if (sortOption === "recent") {
        return dateB.localeCompare(dateA);
      } else {
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

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [notesData, lotsData] = await Promise.all([
        getNoteUseCase.execute(),
        getLotesUseCase.execute(),
      ]);
      setBitacoras(notesData);
      setLotes(lotsData);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al cargar datos";
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
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
    lotes,
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
