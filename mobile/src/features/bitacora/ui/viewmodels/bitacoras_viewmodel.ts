import { useMemo, useState } from "react";

import type { BitacoraRouteItem } from "../../../../core/navigation/app_navigator";

type SortOption = "recent" | "old";

type UseBitacorasViewModelParams = {
  onOpenBitacora: (bitacora: BitacoraRouteItem) => void;
  onAddBitacora: () => void;
};

const BITACORAS: BitacoraRouteItem[] = [
  {
    id: 1,
    title: "Bitácora de riego semanal",
    lot: "Lote 1",
    description: "Se realizó revisión general del riego semanal del cultivo.",
    imageUri: null,
    createdAt: "2026-05-15",
  },
  {
    id: 2,
    title: "Bitácora de revisión de hojas",
    lot: "Lote 2",
    description: "Se revisó el estado de las hojas y se registraron novedades.",
    imageUri: null,
    createdAt: "2026-05-12",
  },
  {
    id: 3,
    title: "Bitácora de control de plagas",
    lot: "Lote 1",
    description: "Se hizo una inspección para identificar posibles plagas.",
    imageUri: null,
    createdAt: "2026-05-10",
  },
  {
    id: 4,
    title: "Bitácora de fertilización",
    lot: "Lote 3",
    description: "Se registró la aplicación de fertilizante en el cultivo.",
    imageUri: null,
    createdAt: "2026-05-08",
  },
];

const LOTES = ["Todos", "Lote 1", "Lote 2", "Lote 3", "Lote 4"];

export function useBitacorasViewModel({
  onOpenBitacora,
  onAddBitacora,
}: UseBitacorasViewModelParams) {
  const [showMenu, setShowMenu] = useState(false);
  const [showLots, setShowLots] = useState(false);
  const [selectedLot, setSelectedLot] = useState("Todos");
  const [sortOption, setSortOption] = useState<SortOption>("recent");

  const filteredBitacoras = useMemo(() => {
    const filtered =
      selectedLot === "Todos"
        ? BITACORAS
        : BITACORAS.filter((item) => item.lot === selectedLot);

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
    selectedLot === "Todos" ? "Mostrando todos los lotes" : `Mostrando ${selectedLot}`
  } · ${sortOption === "recent" ? "Más recientes" : "Más antiguas"}`;

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