import React from "react";
import { View, StyleSheet, Text, ActionSheetIOS } from "react-native";
import { useForm, Controller } from "react-hook-form";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import BirthdateInput from "@/components/BirthdateInput";

const ProfileComponent: React.FC = () => {
  const { control, handleSubmit, formState } = useForm();

  const showActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["homme", "femme", "Cancel"],
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // "homme" selected
          // Handle logic here
        } else if (buttonIndex === 1) {
          // "femme" selected
          // Handle logic here
        }
      }
    );
  };

  const onSubmit = (data: any) => {
    console.log(data);
    // Handle form submission logic here
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="nom"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            label="Nom"
            placeholder="Nom"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            
            error={formState.errors?.nom?.message as string}
            containerStyle={styles.input}
          />
        )}
      />

      <Controller
        control={control}
        name="prenom"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            label="Prénom"
            placeholder="Prénom"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            
            error={formState.errors?.prenom?.message as string}
            containerStyle={styles.input}
          />
        )}
      />

      <Controller
        control={control}
        name="birthdate"
        render={({ field: { onChange, onBlur, value } }) => (
          <BirthdateInput
            label="Date de naissance"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={formState.errors?.birthdate?.message as string}
            containerStyle={styles.input}
          />
        )}
      />

      <View style={styles.input}>
        <Text style={styles.label}>Genre</Text>
        <CustomInput
        placeholder="Select your gender"
          value={""}
          onTouchEnd={showActionSheet}
          containerStyle={styles.input}
          editable={false}
        />
      </View>

      <CustomButton
        title="Confirmer"
        onPress={handleSubmit(onSubmit)}
        containerStyle={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical:40
  },
  input: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: "PoppinsMedium",
    color: "#808080",
    marginBottom: 5,
  },
  button: {
    marginTop: 20,
    width: "100%",
  },
});

export default ProfileComponent;
