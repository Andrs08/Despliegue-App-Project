// import { useCallback, useMemo, useState } from "react";
// import { Alert } from "react-native";
// import { useFocusEffect } from "@react-navigation/native";

// import type {
//   EtapaLote,
//   LoteRouteItem,
// } from "../../../../core/navigation/app_navigator";
// import {
//   deleteLote,
//   getEtapaIndex,
//   getEtapaLabel,
//   getLoteById,
// } from "../../infrastructure/persistence/lote_mock_repository";

// export type LoteStageProgressItem = {
//   key: EtapaLote;
//   label: string;
//   shortLabel: string;
//   icon: string;
// };

// type UseDetailLoteViewModelParams = {
//   loteId: number;
//   onEditLote: (loteId: number) => void;
//   onRegisterData: (loteId: number) => void;
//   onDeleted: () => void;
// };

// const LOTE_STAGES: LoteStageProgressItem[] = [
//   {
//     key: "preparacion_suelo",
//     label: "Preparación del suelo",
//     shortLabel: "Prep.",
//     icon: "leaf-outline",
//   },
//   {
//     key: "siembra",
//     label: "Siembra",
//     shortLabel: "Siembra",
//     icon: "flower-outline",
//   },
//   {
//     key: "desarrollo_vegetativo",
//     label: "Desarrollo vegetativo",
//     shortLabel: "Desarrollo",
//     icon: "trending-up-outline",
//   },
//   {
//     key: "floracion",
//     label: "Floración",
//     shortLabel: "Floración",
//     icon: "flower",
//   },
//   {
//     key: "fructificacion",
//     label: "Fructificación",
//     shortLabel: "Fructificación",
//     icon: "nutrition-outline",
//   },
//   {
//     key: "cosecha",
//     label: "Cosecha",
//     shortLabel: "Cosecha",
//     icon: "basket-outline",
//   },
// ];

// const MOCK_ALERTS = [
//   {
//     id: 1,
//     title: "Falta de riego en algunas zonas",
//     timeAgo: "Hace 2 días",
//   },
//   {
//     id: 2,
//     title: "Falta de riego en algunas zonas",
//     timeAgo: "Hace 2 días",
//   },
// ];

// function calculateDaysSinceStart(fechaInicio: string): number {
//   const startDate = new Date(fechaInicio);
//   const currentDate = new Date();

//   if (Number.isNaN(startDate.getTime())) {
//     return 0;
//   }

//   const diffInMilliseconds = currentDate.getTime() - startDate.getTime();
//   const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

//   return Math.max(diffInDays, 0);
// }

// export function useDetailLoteViewModel({
//   loteId,
//   onEditLote,
//   onRegisterData,
//   onDeleted,
// }: UseDetailLoteViewModelParams) {
//   const [lote, setLote] = useState<LoteRouteItem | null>(null);
//   const [showOptionsMenu, setShowOptionsMenu] = useState(false);
//   const [selectedCarouselStage, setSelectedCarouselStage] =
//     useState<EtapaLote | null>(null);

//   useFocusEffect(
//     useCallback(() => {
//       const currentLote = getLoteById(loteId);

//       setLote(currentLote);

//       if (currentLote) {
//         setSelectedCarouselStage(currentLote.etapa);
//       }
//     }, [loteId])
//   );

//   const currentStageIndex = useMemo(() => {
//     if (!lote) {
//       return -1;
//     }

//     return getEtapaIndex(lote.etapa);
//   }, [lote]);

//   const currentStageLabel = lote ? getEtapaLabel(lote.etapa) : "";

//   const selectedCarouselStageData = useMemo(() => {
//     return (
//       LOTE_STAGES.find((stage) => stage.key === selectedCarouselStage) ??
//       LOTE_STAGES[0]
//     );
//   }, [selectedCarouselStage]);

//   const daysSinceStart = lote ? calculateDaysSinceStart(lote.fechaInicio) : 0;

//   const handleToggleOptionsMenu = () => {
//     setShowOptionsMenu((currentValue) => !currentValue);
//   };

//   const handleSelectCarouselStage = (stage: EtapaLote) => {
//     setSelectedCarouselStage(stage);
//   };

//   const handleEditLote = () => {
//     setShowOptionsMenu(false);
//     onEditLote(loteId);
//   };

//   const handleRegisterData = () => {
//     onRegisterData(loteId);
//   };

//   const handleDeleteLote = () => {
//     setShowOptionsMenu(false);

//     Alert.alert(
//       "Eliminar lote",
//       "¿Estás seguro de que deseas eliminar este lote?",
//       [
//         {
//           text: "Cancelar",
//           style: "cancel",
//         },
//         {
//           text: "Eliminar",
//           style: "destructive",
//           onPress: () => {
//             deleteLote(loteId);
//             onDeleted();
//           },
//         },
//       ]
//     );
//   };

//   return {
//     lote,
//     stages: LOTE_STAGES,
//     alerts: MOCK_ALERTS,
//     showOptionsMenu,
//     currentStageIndex,
//     currentStageLabel,
//     selectedCarouselStage,
//     selectedCarouselStageData,
//     daysSinceStart,
//     handleToggleOptionsMenu,
//     handleSelectCarouselStage,
//     handleEditLote,
//     handleDeleteLote,
//     handleRegisterData,
//   };
// }