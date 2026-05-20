import React from "react";
import {
  Image,
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
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../../../core/navigation/app_navigator";
import { AppHeader } from "../../../../shared/ui/app_header";
import { BottomNavigationBar } from "../../../../shared/ui/bottom_navigation_bar";
import { useAddBitacoraViewModel } from "../viewmodels/add_bitacora_viewmodel";

type AddBitacoraRouteProp = RouteProp<RootStackParamList, "AddBitacora">;

export function AddBitacoraPage() {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = height < 700;
  const horizontalPadding = width < 360 ? 24 : width < 400 ? 32 : 42;
  const headerHeight = Math.min(Math.max(height * 0.17, 105), 140);
  const cardPaddingTop = isSmallPhone ? 28 : 42;
  const titleFontSize = width < 360 ? 34 : 38;
  const descriptionHeight = isSmallPhone ? 130 : 150;
  const uploadHeight = isSmallPhone ? 120 : 135;
  const uploadHeightWithImage = isSmallPhone ? 240 : 280;
  const previewImageHeight = isSmallPhone ? 150 : 190;

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const route = useRoute<AddBitacoraRouteProp>();

  const {
    lots,
    isEditMode,
    title,
    lot,
    description,
    showLots,
    selectedImageUri,
    errors,
    showOptionsMenu,
    handleToggleOptionsMenu,
    handleDelete,
    handleTitleChange,
    handleDescriptionChange,
    handleSelectLot,
    handleToggleLots,
    handleSelectImage,
    handleCancel,
    handleSave,
  } = useAddBitacoraViewModel({
    routeParams: route.params,
    onCancel: () => {
      navigation.navigate("Bitacoras");
    },
    onSaved: () => {
      navigation.navigate("Bitacoras");
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

          {isEditMode ? (
            <TouchableOpacity
              style={styles.optionsButton}
              activeOpacity={0.75}
              onPress={handleToggleOptionsMenu}
            >
              <Ionicons
                name="ellipsis-vertical"
                size={22}
                color={COLORS.green}
              />
            </TouchableOpacity>
          ) : null}

          {showOptionsMenu ? (
            <View style={styles.optionsMenu}>
              <TouchableOpacity
                style={styles.optionsMenuItem}
                activeOpacity={0.75}
                onPress={handleDelete}
              >
                <Text style={styles.deleteOptionText}>Eliminar lote</Text>
              </TouchableOpacity>
            </View>
          ) : null}

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
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
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
                {isEditMode ? "Editar bitácora" : "Agregar bitácora"}
              </Text>

              <Text style={styles.subtitle}>
                {isEditMode
                  ? "Actualiza la información de tu bitácora"
                  : "Crea una nueva bitácora"}
              </Text>

              <View style={styles.formCard}>
                <View
                  style={[
                    styles.inputContainer,
                    errors.title ? styles.inputError : null,
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    placeholder="Agrega tu título"
                    placeholderTextColor={COLORS.green}
                    value={title}
                    onChangeText={handleTitleChange}
                    maxLength={100}
                  />
                </View>

                <Text style={styles.counterText}>{title.length}/100</Text>

                {errors.title ? (
                  <Text style={styles.errorText}>{errors.title}</Text>
                ) : null}

                <TouchableOpacity
                  style={[
                    styles.inputContainer,
                    styles.selectContainer,
                    isEditMode ? styles.staticLotInput : null,
                    errors.lot ? styles.inputError : null,
                  ]}
                  activeOpacity={isEditMode ? 1 : 0.8}
                  onPress={handleToggleLots}
                  disabled={isEditMode}
                >
                  <Text
                    style={[
                      styles.selectText,
                      isEditMode
                        ? styles.staticLotText
                        : lot
                          ? styles.selectedText
                          : styles.placeholderText,
                    ]}
                  >
                    {lot || "Escoge tu lote"}
                  </Text>

                  {!isEditMode ? (
                    <Ionicons
                      name={showLots ? "chevron-up" : "chevron-down"}
                      size={18}
                      color={COLORS.green}
                    />
                  ) : null}
                </TouchableOpacity>

                {!isEditMode && showLots ? (
                  <View style={styles.dropdown}>
                    {lots.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.dropdownItem}
                        activeOpacity={0.8}
                        onPress={() => handleSelectLot(item.nombre)}
                      >
                        <Text style={styles.dropdownText}>{item.nombre}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}

                {errors.lot ? (
                  <Text style={styles.errorText}>{errors.lot}</Text>
                ) : null}

                <TouchableOpacity
                  style={[
                    styles.uploadBox,
                    {
                      minHeight: selectedImageUri
                        ? uploadHeightWithImage
                        : uploadHeight,
                    },
                  ]}
                  activeOpacity={0.8}
                  onPress={handleSelectImage}
                >
                  {selectedImageUri ? (
                    <>
                      <Image
                        source={{ uri: selectedImageUri }}
                        style={[
                          styles.previewImage,
                          {
                            height: previewImageHeight,
                          },
                        ]}
                        resizeMode="cover"
                      />

                      <Text style={styles.uploadTitle}>
                        Imagen seleccionada
                      </Text>

                      <Text style={styles.uploadSubtitle}>
                        Toca para cambiarla
                      </Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="camera" size={30} color={COLORS.gray} />

                      <Text style={styles.uploadTitle}>
                        Toca para subir una imagen
                      </Text>

                      <Text style={styles.uploadSubtitle}>JPG, PNG o JPEG</Text>
                    </>
                  )}
                </TouchableOpacity>

                <View
                  style={[
                    styles.descriptionContainer,
                    {
                      minHeight: descriptionHeight,
                    },
                    errors.description ? styles.inputError : null,
                  ]}
                >
                  <TextInput
                    style={styles.descriptionInput}
                    placeholder="Agrega una descripción"
                    placeholderTextColor={COLORS.green}
                    value={description}
                    onChangeText={handleDescriptionChange}
                    multiline
                    textAlignVertical="top"
                    maxLength={250}
                  />
                </View>

                {errors.description ? (
                  <Text style={styles.errorText}>{errors.description}</Text>
                ) : null}
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  activeOpacity={0.8}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelButtonText}>cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveButton}
                  activeOpacity={0.8}
                  onPress={handleSave}
                >
                  <Ionicons
                    name="save-outline"
                    size={15}
                    color={COLORS.background}
                  />

                  <Text style={styles.saveButtonText}>
                    {isEditMode ? "actualizar" : "guardar"}
                  </Text>
                </TouchableOpacity>
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
  black: "#000000",
  pink: "#E4568B",
  error: "#C94C4C",
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
    marginBottom: 28,
  },
  formCard: {
    width: "100%",
    marginBottom: 18,
  },
  inputContainer: {
    width: "100%",
    minHeight: 48,
    borderWidth: 1,
    borderColor: COLORS.green,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
    marginBottom: 8,
    backgroundColor: COLORS.background,
  },
  staticLotInput: {
    borderColor: COLORS.gray,
  },
  staticLotText: {
    color: COLORS.gray,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  input: {
    width: "100%",
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 14,
    lineHeight: 18,
    color: COLORS.black,
    paddingVertical: 0,
  },
  counterText: {
    alignSelf: "flex-end",
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.gray,
    fontSize: 12,
    lineHeight: 15,
    marginBottom: 10,
    marginRight: 4,
  },
  selectContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 14,
    lineHeight: 18,
  },
  placeholderText: {
    color: COLORS.green,
  },
  selectedText: {
    color: COLORS.black,
  },
  dropdown: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.green,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    marginBottom: 12,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(93, 123, 61, 0.18)",
  },
  dropdownText: {
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 14,
    color: COLORS.green,
  },
  uploadBox: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.green,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    backgroundColor: COLORS.background,
    paddingVertical: 14,
    paddingHorizontal: 14,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    borderRadius: 10,
    marginBottom: 12,
  },
  uploadTitle: {
    fontFamily: "AlfaSlabOne_400Regular",
    color: COLORS.green,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
    textAlign: "center",
  },
  uploadSubtitle: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.gray,
    fontSize: 11,
    lineHeight: 14,
    textAlign: "center",
  },
  descriptionContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.green,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingTop: 12,
    backgroundColor: COLORS.background,
  },
  descriptionInput: {
    flex: 1,
    width: "100%",
    fontFamily: "MaidenOrange_400Regular",
    fontSize: 14,
    lineHeight: 18,
    color: COLORS.black,
    padding: 0,
    minHeight: 110,
  },
  errorText: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.error,
    fontSize: 13,
    lineHeight: 16,
    marginTop: 2,
    marginBottom: 12,
    marginLeft: 4,
  },
  buttonsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 10,
  },
  cancelButton: {
    borderWidth: 1.5,
    borderColor: COLORS.pink,
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    marginRight: 28,
  },
  cancelButtonText: {
    fontFamily: "AlfaSlabOne_400Regular",
    color: COLORS.pink,
    fontSize: 12,
    lineHeight: 17,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.pink,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
  },
  saveButtonText: {
    fontFamily: "AlfaSlabOne_400Regular",
    color: COLORS.background,
    fontSize: 12,
    lineHeight: 17,
    marginLeft: 6,
  },
  optionsButton: {
    position: "absolute",
    top: 20,
    right: 16,
    zIndex: 20,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  optionsMenu: {
    position: "absolute",
    top: 52,
    right: 14,
    zIndex: 30,
    width: 112,
    borderRadius: 2,
    backgroundColor: COLORS.background,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden",
  },
  optionsMenuItem: {
    minHeight: 42,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  deleteOptionText: {
    fontFamily: "MaidenOrange_400Regular",
    color: COLORS.pink,
    fontSize: 13,
  },
});
