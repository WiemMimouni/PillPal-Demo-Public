import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { imagePlaceholder } from "@/constants/images";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useHeader } from "context/HeaderContext";

const UploadImages = () => {
  const [title, setTitle] = useState<string>();
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();
  const params = useLocalSearchParams();
  const currentFolder = `pillPalFolders_${params.folder}`;
 const { screenName, setScreenName } = useHeader(); // Access screen name from the header context
 useEffect(() => {
   setScreenName("My pills");
 }, []);
  useFocusEffect(
    useCallback(() => {
      setTitle("");
      setImage(null);
    }, [])
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) return Alert.alert("Please choose an image.");
    if (!title) return Alert.alert("Please choose a title.");
    const extension = image.split(".").pop();
    const fileName = `${title}.${extension}`;
    const destinationPath = `${FileSystem.documentDirectory}${currentFolder}/${fileName}`;
    console.log(extension)
    console.log(fileName)
    console.log(destinationPath)

    try {
      await FileSystem.copyAsync({
        from: image,
        to: destinationPath,
      });
      Alert.alert("Success", `Image saved to ${currentFolder}`);
      router.push("Files");
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleLabel}>Title</Text>
        <TextInput
          value={title}
          style={styles.titleInput}
          onChangeText={(text) => setTitle(text)}
        />
      </View>
      <TouchableOpacity onPress={pickImage} style={styles.uploadContainer}>
        {image ? (
          <Image style={styles.image} source={{ uri: image }} />
        ) : (
          <SvgXml
            style={{ zIndex: 10, alignSelf: "center" }}
            xml={imagePlaceholder}
          />
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={uploadImage} style={styles.uploadButton}>
        <Text style={styles.uploadText}>confirmer</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "Files",
          })
        }
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: hp(5),
    gap: hp(5),
  },
  titleContainer: {
    width: "90%",
    gap: hp(1),
  },
  titleInput: {
    borderRadius: wp(3),
    backgroundColor: "#F1F1F1",
    borderWidth: 1,
    borderColor: "#31E3B9",
    paddingLeft: wp(3),
    paddingVertical: hp(1),
  },
  titleLabel: {
    fontSize: wp(4),
    color: "#666161",
  },
  uploadContainer: {
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: "#31E3B9",
    width: "90%",
    backgroundColor: "#F1F1F1",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp(6),
  },
  uploadButton: {
    borderRadius: wp(2),
    backgroundColor: "#31E3B9",
    width: "90%",
    paddingVertical: hp(2),
  },
  uploadText: {
    fontSize: wp(4),
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  backButton: {
    alignItems: "center",
  },
  backButtonText: {
    textDecorationLine: "underline",
    color: "grey",
  },
  image: {
    width: wp(50),
    height: hp(25),
  },
});

export default UploadImages;
