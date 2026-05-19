import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
  EstadoLote,
  LoteRouteItem,
  RootStackParamList,
} from "../../../../core/navigation/app_navigator";
import { AppHeader } from "../../../../shared/ui/app_header";
import { BottomNavigationBar } from "../../../../shared/ui/bottom_navigation_bar";
import { useLotesViewModel } from "../viewmodels/lotes_viewmodel";

export function LotesPage() {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = height < 700;
  const horizontalPadding = width < 360 ? 24 : width < 400 ? 32 : 42;
  const headerHeight = Math.min(Math.max(height * 0.17, 105), 140);
  const cardPaddingTop = isSmallPhone ? 28 : 42;
  const titleFontSize = width < 360 ? 34 : 38;

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    filters,
    lotes,
    searchText,
    selectedFilter,
    handleSearchChange,
    handleSelectFilter,
    handleAddLote,
    handleOpenLote,
  } = useLotesViewModel({
    onAddLote: () => {
      navigation.navigate("LoteForm", {
        mode: "create",
      });
    },
    onOpenLote: (lote: LoteRouteItem) => {
      navigation.navigate("DetailLote", {
        loteId: lote.id,
      });
    },
  });

  const [fontsLoaded] = useFonts({
    GravitasOne_400Regular,
    MaidenOrange_400Regular,
    AlfaSlabOne_400Regular,
  });

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
              keyboardShouldPersistTaps="handled"
            >
              <Text
                style={[
                  styles.title,
                  {
                    fontSize: titleFontSize,
                    lineHeight: titleFontSize + 4,
                  },
                ]}
              >
                Lotes
              </Text>

              <Text style={styles.subtitle}>Gestiona tus áreas de cultivo</Text>

              <View style={styles.searchContainer}>
                <Ionicons
                  name="search-outline"
                  size={18}
                  color={COLORS.black}
                />

                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar lote ..."
                  placeholderTextColor={COLORS.gray}
                  value={searchText}
                  onChangeText={handleSearchChange}
                />
              </View>

              <ScrollView
                horizontal
                style={styles.filtersScroll}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersContainer}
              >
                {filters.map((filter) => {
                  const isSelected = selectedFilter === filter;
                  const chipColor = getFilterColor(filter);

                  return (
                    <TouchableOpacity
                      key={filter}
                      style={[
                        styles.filterChip,
                        {
                          borderColor: chipColor,
                          backgroundColor: isSelected
                            ? chipColor
                            : COLORS.background,
                        },
                      ]}
                      activeOpacity={0.8}
                      onPress={() => handleSelectFilter(filter)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          {
                            color: isSelected ? COLORS.background : chipColor,
                          },
                        ]}
                      >
                        {filter === "Todos" ? "Todas" : filter}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {lotes.length > 0 ? (
                <View style={styles.listContainer}>
                  {lotes.map((lote) => {
                    const statusColor = getEstadoColor(lote.estado);
                    const statusSoftColor = getEstadoSoftColor(lote.estado);

                    return (
                      <TouchableOpacity
                        key={lote.id}
                        style={styles.loteItem}
                        activeOpacity={0.85}
                        onPress={() => handleOpenLote(lote)}
                      >
                        <View
                          style={[
                            styles.loteDot,
                            {
                              backgroundColor: statusSoftColor,
                            },
                          ]}
                        />

                        <View style={styles.loteInfo}>
                          <Text style={styles.loteName}>{lote.nombre}</Text>

                          <Text
                            style={[
                              styles.loteHealthStatus,
                              {
                                color: statusColor,
                              },
                            ]}
                          >
                            Estado de salud: {lote.estado}
                          </Text>
                        </View>

                        <Ionicons
                          name="arrow-forward"
                          size={18}
                          color={COLORS.green}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}

              <View style={styles.addContainer}>
                <TouchableOpacity
                  style={styles.addButton}
                  activeOpacity={0.85}
                  onPress={handleAddLote}
                >
                  <Ionicons
                    name="add"
                    size={24}
                    color={COLORS.background}
                  />
                </TouchableOpacity>

                <Text style={styles.addText}>Agregar lote</Text>
              </View>
            </ScrollView>
          </View>

          <BottomNavigationBar activeRoute="Lots" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type FilterOption = "Todos" | EstadoLote;

function getFilterColor(filter: FilterOption): string {
  const colors: Record<FilterOption, string> = {
    Todos: COLORS.green,
    Sano: COLORS.blue,
    Observación: COLORS.yellow,
    Riesgo: COLORS.pink,
  };

  return colors[filter];
}

function getEstadoColor(estado: EstadoLote): string {
  const colors: Record<EstadoLote, string> = {
    Sano: COLORS.blue,
    Observación: COLORS.yellow,
    Riesgo: COLORS.pink,
  };

  return colors[estado];
}

function getEstadoSoftColor(estado: EstadoLote): string {
  const colors: Record<EstadoLote, string> = {
    Sano: COLORS.softBlue,
    Observación: COLORS.softYellow,
    Riesgo: COLORS.softPink,
  };

  return colors[estado];
}

const COLORS = {
  green: "#5D7B3D",
  background: "#FFFFF1",
  yellow: "#F6C94D",
  blue: "#4A7DBA",
  gray: "#959595",
  pink: "#E4568B",
  softPink: "#FDE7EC",
  softYellow: "#FFF5E1",
  softBlue: "#E8F1FB",
  black: "#000000",
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
    paddingBottom: 90,
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
    marginBottom: 20,
  },
  searchContainer: {
    width: "100%",
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.green,
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  searchInput: {
    flex: 1,
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 15,
    color: COLORS.black,
    paddingVertical: 0,
    marginLeft: 8,
  },
  filtersScroll: {
    width: "100%",
    height: 34,
    maxHeight: 34,
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: 28,
  },
  filtersContainer: {
    height: 34,
    alignItems: "center",
    flexGrow: 0,
  },
  filterChip: {
    height: 24,
    minWidth: 58,
    borderWidth: 1,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    marginRight: 14,
  },
  filterChipText: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 13,
    lineHeight: 16,
  },
  listContainer: {
    width: "100%",
  },
  loteItem: {
    width: "100%",
    minHeight: 58,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.green,
    backgroundColor: COLORS.background,
    marginBottom: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  loteDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 12,
  },
  loteInfo: {
    flex: 1,
  },
  loteName: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.green,
    fontSize: 16,
    lineHeight: 19,
  },
  loteHealthStatus: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 12,
    lineHeight: 15,
  },
  addContainer: {
    alignSelf: "flex-end",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 10,
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
    fontSize: 11,
    lineHeight: 13,
  },
});