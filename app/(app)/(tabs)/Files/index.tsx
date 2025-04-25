import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { SvgXml } from "react-native-svg";
import { createFolderIcon, folderIcon, searchIcon, x } from "@/constants/images";
import { useFocusEffect, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons"; // Plus icon from AntDesign
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as ImagePicker from "expo-image-picker"

type FileType = {
  name: string;
  uri: string;
};

const Files = () => {
  const [folderName, setFolderName] = useState<string>("");
  const [folders, setFolders] = useState<string[]>([]);
  const [files, setFiles] = useState<FileType[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageModalVisible, setImageModalVisible] = useState<boolean>(false);
  const [folderModalVisible, setFolderModalVisible] = useState<boolean>(false);
  const [folderSearchQuery, setFolderSearchQuery] = useState<string>();
  const [fileSearchQuery, setFileSearchQuery] = useState<string>();
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null)
  const [imageTitle, setImageTitle] = useState<string>()
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  useEffect(() => {
    loadFolders();
  }, [folderSearchQuery]);

  useFocusEffect(
    useCallback(() => {
      if (currentFolder) {
        loadFilesInFolder(currentFolder);
      }
    }, [currentFolder, fileSearchQuery])
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
      setModalVisible(true)
    }
  }

  const saveImage = async () => {
    if (!image) {
      Alert.alert("Please choose an image.")
      return
    }
    if (!imageTitle) {
      Alert.alert("Please choose a title.")
      return
    }
    const extension = image.split('.').pop()
    const directory = `pillPalFolders_${currentFolder}`
    const fileName = `${imageTitle}.${extension}`
    const destinationPath = `${FileSystem.documentDirectory}${directory}/${fileName}`

    try {
      await FileSystem.copyAsync({
        from: image,
        to: destinationPath,
      })
      Alert.alert("Success", `Image saved to ${currentFolder}`)
      setModalVisible(false)
      setImageTitle('')
      setImage(null)
      // displaying the new picture added
      setFiles([...files, { name: fileName, uri: destinationPath}])
    }
    catch (error) {
      console.error("Error saving image:", error)
    }
  }

  const createFolder = async (folderName: string) => {
    if (!folderName) return;
    const prefix = `pillPalFolders_${folderName}`;
    const folderPath = `${FileSystem.documentDirectory}${prefix}`;

    const folderInfo = await FileSystem.getInfoAsync(folderPath);

    if (folderInfo.exists)
      return Alert.alert(
        `Folder ${folderName} already exists at ${folderPath}.`
      );

    try {
      await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });
      loadFolders();
    } catch (error) {
      console.log(error);
    }
  };

  const loadFolders = async () => {
    try {
      const files = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory as string
      );
      let filteredFolders = files.filter((file) =>
        file.startsWith("pillPalFolders_")
      );

      if (folderSearchQuery) {
        filteredFolders = filteredFolders.filter((folder) =>
          folder.toLowerCase().includes(folderSearchQuery.toLowerCase())
        );
      }

      setFolders(filteredFolders);
    } catch (error) {
      console.error("Error reading directory:", error);
    }
  };

  const loadFilesInFolder = async (folderName: string) => {
    if (!currentFolder) {
      setCurrentFolder(folderName);
    }
    const folderPath = `${FileSystem.documentDirectory}pillPalFolders_${folderName}`;
    try {
      let files = await FileSystem.readDirectoryAsync(folderPath);

      if (fileSearchQuery) {
        files = files.filter((file) =>
          file.toLowerCase().includes(fileSearchQuery.toLowerCase())
        );
      }

      const fileObjects = files.map((file) => ({
        name: file,
        uri: `${folderPath}/${file}`,
      }));
      setFiles(fileObjects);
      console.log(fileObjects)
    } catch (error) {
      console.error(`Error reading files in folder ${folderName}:`, error);
    }
  };

  const handleImageClick = (uri: string) => {
    setSelectedImage(uri);
    setImageModalVisible(true);
  };

  const handleCreateFolder = () => {
    setFolderModalVisible(true);
  };

  const handleFolderCreation = () => {
    createFolder(folderName);
    setFolderModalVisible(false);
    setFolderName("");
  };

  const goBackToFolders = () => {
    setCurrentFolder(null);
    setFiles([]);
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.imageModalView}>
            <Text style={styles.modalText}>Enter Image Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Image Title"
              onChangeText={setImageTitle}
              value={imageTitle}
            />
            <Button title="Save Image" onPress={saveImage} />
          </View>
        </View>
      </Modal>
      {!currentFolder && (
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search"
              style={styles.searchInput}
              value={folderSearchQuery}
              onChangeText={(text) => setFolderSearchQuery(text)}
            />
            <SvgXml style={styles.searchIcon} xml={searchIcon} />
          </View>
        </View>
      )}
      {currentFolder && (
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search"
            style={styles.searchInput}
            value={fileSearchQuery}
            onChangeText={(text) => setFileSearchQuery(text)}
          />
          <SvgXml style={styles.searchIcon} xml={searchIcon} />
        </View>
      )}

      <View style={styles.foldersContainer}>
        {currentFolder ? (
          <FlatList
            data={files}
            keyExtractor={(item) => item.name}
            numColumns={3}
            contentContainerStyle={styles.gridContainer}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleImageClick(item.uri)}>
                <View style={styles.gridItem}>
                  <Image source={{ uri: item.uri }} style={styles.image} />
                  <Text>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <FlatList
            data={folders}
            keyExtractor={(item) => item}
            numColumns={3}
            contentContainerStyle={styles.gridContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  loadFilesInFolder(item.replace("pillPalFolders_", ""))
                }
              >
                <View style={styles.gridItem}>
                  <SvgXml xml={folderIcon} />
                </View>
                <Text style={styles.folderName}>
                  {item.replace("pillPalFolders_", "")}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
      {selectedImage && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={imageModalVisible}
          onRequestClose={() => setImageModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Image source={{ uri: selectedImage }} style={styles.fullImage} />
            <Button title="Close" onPress={() => setImageModalVisible(false)} />
          </View>
        </Modal>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={folderModalVisible}
        onRequestClose={() => setFolderModalVisible(false)}
      >
        <View style={styles.modalView}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setFolderModalVisible(false)} style={{ position: "absolute", right: 15 }}>
                <SvgXml xml={x} />
              </TouchableOpacity>
            </View>
            <View style={{ ...styles.modalContent, padding: wp(5) }}>
              <TextInput
                style={styles.input}
                placeholder="Folder Name"
                value={folderName}
                onChangeText={(text) => setFolderName(text)}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => setFolderModalVisible(false)}
                  style={styles.cancelButton}
                >
                  <Text>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.createButton} onPress={handleFolderCreation}>
                  <Text style={{ color: "white" }}>Crée</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {/* Floating buttons */}
      {currentFolder ? (
        <>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() =>
              router.push({
                pathname: "UploadImages",
                params: {
                  folder: currentFolder,
                },
              })
            }
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <AntDesign name="upload" size={wp(8)} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.takePictureButton}
            onPress={pickImage}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <AntDesign name="camera" size={wp(8)} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBackToFolders}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <AntDesign name="arrowleft" size={wp(8)} color="white" />
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={handleCreateFolder}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <SvgXml xml={createFolderIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Files;

const styles = StyleSheet.create({
  container: {
    paddingVertical: hp(2),
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: wp(1.5),
  },
  searchContainer: {
    width: wp(80),
    display: "flex",
    alignSelf: "center",
    position: "relative",
  },
  searchInput: {
    backgroundColor: "#e8fcf4",
    alignSelf: "center",
    borderRadius: wp(2),
    paddingVertical: hp(1),
    paddingLeft: wp(12),
    width: "100%",
  },
  searchIcon: {
    position: "absolute",
    top: hp(1.5),
    left: wp(3),
  },
  foldersContainer: {
    display: "flex",
    flexDirection: "row",
    gap: wp(2),
  },
  gridContainer: {
    flexGrow: 1,
    alignItems: "center",
    gap: wp(2.5),
  },
  gridItem: {
    flex: 1,
    backgroundColor: "#e8fcf4",
    borderRadius: wp(2),
    padding: wp(2),
    margin: wp(1),
    alignItems: "center",
  },
  folderName: {
    marginTop: hp(1),
    textAlign: "center",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalHeader: {
    height: 50,
    width: wp(80),
    backgroundColor: "#5BD1B8",
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
    position: "relative",
    display: "flex",
    justifyContent: "center",

  },
  modalContent: {
    width: wp(80),
    backgroundColor: "white",
    borderRadius: wp(2),
    alignItems: "center",
  },
  modalTitle: {
    fontSize: wp(5),
    marginBottom: hp(2),
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    marginBottom: hp(2),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderColor: "#5BD1B8"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  fullImage: {
    width: wp(90),
    height: hp(90),
    resizeMode: "contain",
  },
  image: {
    width: wp(25),
    height: hp(12.5),
  },
  floatingButton: {
    position: "absolute",
    bottom: hp(12),
    right: wp(5),
    width: wp(15),
    height: wp(15),
    borderRadius: wp(7.5),
    backgroundColor: "#31E3B9",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 1000, // Ensure it's on top
  },
  uploadButton: {
    position: "absolute",
    bottom: hp(12),
    right: wp(5),
    width: wp(15),
    height: wp(15),
    borderRadius: wp(7.5),
    backgroundColor: "#FFC700",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 1000, // Ensure it's on top
  },
  takePictureButton: {
    position: "absolute",
    bottom: hp(23),
    right: wp(5),
    width: wp(15),
    height: wp(15),
    borderRadius: wp(7.5),
    backgroundColor: "#FFC700",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 1000,
  },
  backButton: {
    position: "absolute",
    bottom: hp(12),
    left: wp(5),
    width: wp(15),
    height: wp(15),
    borderRadius: wp(7.5),
    backgroundColor: "#31E3B9",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 1000,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#5BD1B8",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8
  },
  createButton: {
    backgroundColor: "#5BD1B8",
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 8
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  imageModalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '100%',
  }
});
