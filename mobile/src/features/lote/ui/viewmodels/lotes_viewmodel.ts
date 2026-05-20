import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import type {
  EstadoLote,
  LoteRouteItem,
} from "../../../../core/navigation/app_navigator";
import { getLotes } from "../../infrastructure/persistence/lote_mock_repository";

type LoteFilter = "Todos" | EstadoLote;

type UseLotesViewModelParams = {
  onAddLote: () => void;
  onOpenLote: (lote: LoteRouteItem) => void;
};

const FILTERS: LoteFilter[] = ["Todos", "Sano", "Observación", "Riesgo"];

export function useLotesViewModel({
  onAddLote,
  onOpenLote,
}: UseLotesViewModelParams) {
  const [lotes, setLotes] = useState<LoteRouteItem[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<LoteFilter>("Todos");

  useFocusEffect(
    useCallback(() => {
      setLotes(getLotes());
    }, [])
  );

  const filteredLotes = useMemo(() => {
    const cleanSearch = searchText.trim().toLowerCase();

    return lotes.filter((lote) => {
      const matchesSearch = lote.nombre.toLowerCase().includes(cleanSearch);

      const matchesFilter =
        selectedFilter === "Todos" ? true : lote.estado === selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }, [lotes, searchText, selectedFilter]);

  const handleSearchChange = (value: string) => {
    setSearchText(value);
  };

  const handleSelectFilter = (filter: LoteFilter) => {
    setSelectedFilter(filter);
  };

  const handleAddLote = () => {
    onAddLote();
  };

  const handleOpenLote = (lote: LoteRouteItem) => {
    onOpenLote(lote);
  };

  return {
    filters: FILTERS,
    lotes: filteredLotes,
    searchText,
    selectedFilter,
    handleSearchChange,
    handleSelectFilter,
    handleAddLote,
    handleOpenLote,
  };
}