import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import type { EstadoLote, Lote } from "../../domain/entities/lot.entity";
import { GetLotesUseCase } from "../../application/use-cases/get-lots.use-case";
import { FilterLotesUseCase } from "../../application/use-cases/filter-lots.use-case";
import { LocalPreferencesAsyncStorage } from "@/src/core/LocalPreferencesAsyncStorage";
import { ApiLoteRepository } from "../../infrastructure/persistence/api_lot.repository";

export type LoteFilter = "Todos" | EstadoLote;
export const FILTERS: LoteFilter[] = ["Todos", "Sano", "Observación", "Riesgo"];

type UseLotesViewModelParams = {
  onAddLote: () => void;
  onOpenLote: (lote: Lote) => void;
};

const storage = LocalPreferencesAsyncStorage.getInstance();
const repository = new ApiLoteRepository(storage);
const getLotesUseCase = new GetLotesUseCase(repository);
const filterLotesUseCase = new FilterLotesUseCase(repository);

export function useLotesViewModel({
  onAddLote,
  onOpenLote,
}: UseLotesViewModelParams) {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<LoteFilter>("Todos");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLotes = useCallback(async (filter: LoteFilter, search: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const hasFilter = filter !== "Todos";
      const hasSearch = search.trim().length > 0;

      let result: Lote[];

      if (hasFilter || hasSearch) {
        result = await filterLotesUseCase.execute({
          estado: hasFilter ? (filter as EstadoLote) : undefined,
          nombre: hasSearch ? search.trim() : undefined,
        });
      } else {
        result = await getLotesUseCase.execute();
      }

      setLotes(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error cargando los lotes";
      setError(message);
      setLotes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLotes(selectedFilter, searchText);
    }, [selectedFilter, searchText, loadLotes]),
  );

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    loadLotes(selectedFilter, value);
  };

  const handleSelectFilter = (filter: LoteFilter) => {
    setSelectedFilter(filter);
    loadLotes(filter, searchText);
  };

  const handleAddLote = () => {
    onAddLote();
  };

  const handleOpenLote = (lote: Lote) => {
    onOpenLote(lote);
  };

  const handleRetry = () => {
    loadLotes(selectedFilter, searchText);
  };

  return {
    filters: FILTERS,
    lotes,
    searchText,
    selectedFilter,
    isLoading,
    error,
    handleSearchChange,
    handleSelectFilter,
    handleAddLote,
    handleOpenLote,
    handleRetry,
  };
}
