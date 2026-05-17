import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { GravitasOne_400Regular } from "@expo-google-fonts/gravitas-one";
import { MaidenOrange_400Regular } from "@expo-google-fonts/maiden-orange";
import { AlfaSlabOne_400Regular } from "@expo-google-fonts/alfa-slab-one";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type {
  BitacoraRouteItem,
  RootStackParamList,
} from "../../../../core/navigation/app_navigator";
import { AppHeader } from "../../../../shared/ui/app_header";
import { BottomNavigationBar } from "../../../../shared/ui/bottom_navigation_bar";

type SortOption = "recent" | "old";

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

export function BitacorasPage() {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = height < 700;
  const horizontalPadding = width < 360 ? 24 : width < 400 ? 32 : 42;
  const headerHeight = Math.min(Math.max(height * 0.17, 105), 140);
  const cardPaddingTop = isSmallPhone ? 28 : 42;
  const titleFontSize = width < 360 ? 34 : 38;
  const itemHeight = isSmallPhone ? 74 : 82;
  const bitacoraTitleFontSize = width < 360 ? 20 : 22;

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [showMenu, setShowMenu] = useState(false);
  const [showLots, setShowLots] = useState(false);
  const [selectedLot, setSelectedLot] = useState("Todos");
  const [sortOption, setSortOption] = useState<SortOption>("recent");

  const [fontsLoaded] = useFonts({
    GravitasOne_400Regular,
    MaidenOrange_400Regular,
    AlfaSlabOne_400Regular,
  });

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
    navigation.navigate("AddBitacora", {
      mode: "edit",
      bitacora,
    });
  };

  const handleAddBitacora = () => {
    navigation.navigate("AddBitacora", {
      mode: "create",
    });
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <AppHeader imageHeight={headerHeight} />

          <View
            style={[
              styles.card,
              {
                paddingHorizontal: horizontalPadding,
                paddingTop: cardPaddingTop,
              },
            ]}
          >
            <ScrollView
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.headerRow}>
                <View style={styles.headerTextContainer}>
                  <Text
                    style={[
                      styles.title,
                      {
                        fontSize: titleFontSize,
                        lineHeight: titleFontSize + 4,
                      },
                    ]}
                  >
                    Bitácora
                  </Text>

                  <Text style={styles.subtitle}>
                    Aquí están todas tus bitácoras
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.menuButton,
                    showMenu ? styles.menuButtonActive : null,
                  ]}
                  activeOpacity={0.75}
                  onPress={() => setShowMenu(!showMenu)}
                >
                  <Ionicons
                    name="funnel-outline"
                    size={22}
                    color={showMenu ? COLORS.background : COLORS.green}
                  />
                </TouchableOpacity>
              </View>

              {showMenu ? (
                <View style={styles.filterMenu}>
                  <TouchableOpacity
                    style={styles.filterItem}
                    activeOpacity={0.75}
                    onPress={() => setShowLots(!showLots)}
                  >
                    <Text style={styles.filterText}>Filtrar por lote</Text>

                    <Ionicons
                      name={showLots ? "chevron-up" : "chevron-down"}
                      size={16}
                      color={COLORS.green}
                    />
                  </TouchableOpacity>

                  {showLots ? (
                    <View style={styles.lotsContainer}>
                      {LOTES.map((lot) => (
                        <TouchableOpacity
                          key={lot}
                          style={styles.lotItem}
                          activeOpacity={0.75}
                          onPress={() => handleSelectLot(lot)}
                        >
                          <Text
                            style={[
                              styles.lotText,
                              selectedLot === lot ? styles.activeLotText : null,
                            ]}
                          >
                            {lot}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : null}

                  <TouchableOpacity
                    style={styles.filterItem}
                    activeOpacity={0.75}
                    onPress={handleSelectRecent}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        sortOption === "recent"
                          ? styles.activeFilterText
                          : null,
                      ]}
                    >
                      Más reciente
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.filterItemLast}
                    activeOpacity={0.75}
                    onPress={handleSelectOld}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        sortOption === "old" ? styles.activeFilterText : null,
                      ]}
                    >
                      Más antigua
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              <Text style={styles.currentFilterText}>
                {selectedLot === "Todos"
                  ? "Mostrando todos los lotes"
                  : `Mostrando ${selectedLot}`}{" "}
                · {sortOption === "recent" ? "Más recientes" : "Más antiguas"}
              </Text>

              <View style={styles.listContainer}>
                {filteredBitacoras.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.bitacoraCard,
                      {
                        minHeight: itemHeight,
                      },
                    ]}
                    activeOpacity={0.85}
                    onPress={() => handleOpenBitacora(item)}
                  >
                    <Text
                      style={[
                        styles.bitacoraTitle,
                        {
                          fontSize: bitacoraTitleFontSize,
                          lineHeight: bitacoraTitleFontSize + 4,
                        },
                      ]}
                    >
                      {item.title}
                    </Text>

                    <Text style={styles.bitacoraMeta}>
                      {item.lot} · {item.createdAt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.addContainer}>
                <TouchableOpacity
                  style={styles.addButton}
                  activeOpacity={0.85}
                  onPress={handleAddBitacora}
                >
                  <Ionicons
                    name="add"
                    size={24}
                    color={COLORS.background}
                  />
                </TouchableOpacity>

                <Text style={styles.addText}>Agregar{"\n"}bitácora</Text>
              </View>
            </ScrollView>
          </View>

          <BottomNavigationBar activeRoute="Bitacoras" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const COLORS = {
  green: "#5D7B3D",
  background: "#FFFFF1",
  gray: "#959595",
  yellow: "#F6C94D",
  pink: "#E4568B",
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.background,
    overflow: "hidden",
  },
  card: {
    flex: 1,
    marginTop: -28,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  headerRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.green,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 15,
    lineHeight: 18,
    color: COLORS.gray,
  },
  menuButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.4,
    borderColor: COLORS.green,
    backgroundColor: COLORS.background,
  },
  menuButtonActive: {
    backgroundColor: COLORS.green,
  },
  filterMenu: {
    width: "100%",
    borderWidth: 1.4,
    borderColor: COLORS.green,
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    backgroundColor: COLORS.background,
  },
  filterItem: {
    minHeight: 42,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(93, 123, 61, 0.18)",
  },
  filterItemLast: {
    minHeight: 42,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterText: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 17,
    lineHeight: 21,
    color: COLORS.green,
  },
  activeFilterText: {
    color: COLORS.pink,
  },
  lotsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(93, 123, 61, 0.18)",
  },
  lotItem: {
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  lotText: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 15,
    lineHeight: 18,
    color: COLORS.gray,
  },
  activeLotText: {
    color: COLORS.pink,
  },
  currentFilterText: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 14,
    lineHeight: 17,
    color: COLORS.gray,
    marginBottom: 18,
  },
  listContainer: {
    width: "100%",
  },
  bitacoraCard: {
    width: "100%",
    backgroundColor: COLORS.background,
    borderRadius: 10,
    marginBottom: 18,
    paddingHorizontal: 18,
    paddingVertical: 12,
    justifyContent: "center",
    borderWidth: 1.4,
    borderColor: COLORS.green,
  },
  bitacoraTitle: {
    width: "100%",
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.green,
    marginBottom: 2,
  },
  bitacoraMeta: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 13,
    lineHeight: 16,
    color: COLORS.gray,
  },
  addContainer: {
    alignSelf: "flex-end",
    alignItems: "center",
    marginTop: 16,
    marginRight: 4,
    marginBottom: 8,
  },
  addButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.yellow,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  addText: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.green,
    fontSize: 12,
    lineHeight: 13,
    textAlign: "center",
  },
});