import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Location from "expo-location"
import { SvgXml } from 'react-native-svg';
import { storeLocation } from '@/constants/images';

const index = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null)

  useEffect(() => {
    getLocation()
  }, [])

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location)
  }

  const handlePress = (latitude: number, longitude: number) => {
    const url = `geo:${latitude},${longitude}?q=${latitude},${longitude}`;
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  }

  const pharmacies = [
    {
      address: "Avenue Habib Bourguiba, Tunis",
      name: "Pharmacie Centrale de Tunisie",
      num_telephone: "+216 71 240 000",
      location: {
        latitude: 36.8008,
        longitude: 10.1865
      }
    },
    {
      address: "Rue de Marseille, Sousse",
      name: "Pharmacie Al Amal",
      num_telephone: "+216 73 201 000",
      location: {
        latitude: 35.8256,
        longitude: 10.6360
      }
    },
    {
      address: "Avenue Mohamed V, Monastir",
      name: "Pharmacie Monastir",
      num_telephone: "+216 73 500 200",
      location: {
        latitude: 35.7765,
        longitude: 10.8264
      }
    },
    {
      address: "Rue Habib Thameur, Sfax",
      name: "Pharmacie Sfax",
      num_telephone: "+216 74 600 300",
      location: {
        latitude: 34.7390,
        longitude: 10.7603
      }
    },
    {
      address: "Avenue de la Liberté, Bizerte",
      name: "Pharmacie Bizerte",
      num_telephone: "+216 72 300 400",
      location: {
        latitude: 37.2746,
        longitude: 9.8739
      }
    },
    {
      address: "Boulevard 7 Novembre, Gabès",
      name: "Pharmacie Gabès",
      num_telephone: "+216 75 700 500",
      location: {
        latitude: 33.8815,
        longitude: 10.0982
      }
    },
    {
      address: "Avenue Ali Belhouane, Nabeul",
      name: "Pharmacie Nabeul",
      num_telephone: "+216 72 201 600",
      location: {
        latitude: 36.4510,
        longitude: 10.7376
      }
    },
    {
      address: "Rue Mohamed Ali, Kairouan",
      name: "Pharmacie Kairouan",
      num_telephone: "+216 77 600 700",
      location: {
        latitude: 35.6781,
        longitude: 10.0963
      }
    },
    {
      address: "Avenue Farhat Hached, Gafsa",
      name: "Pharmacie Gafsa",
      num_telephone: "+216 76 800 800",
      location: {
        latitude: 34.4250,
        longitude: 8.7842
      }
    },
    {
      address: "Boulevard de l'Environnement, Mahdia",
      name: "Pharmacie Mahdia",
      num_telephone: "+216 73 400 900",
      location: {
        latitude: 35.5047,
        longitude: 11.0622
      }
    }
  ]

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 18, marginVertical: 20 }}>Pharmacies ouverte</Text>
      <FlatList
        data={pharmacies}
        renderItem={({ item }) => <TouchableOpacity style={styles.pharmacyButton} onPress={() => handlePress(item.location.latitude, item.location.longitude)}>
          <SvgXml xml={storeLocation} />
          <View style={styles.pharmacyDetails}>
            <Text style={styles.pharmacyName}>{item.name}</Text>
            <Text>{item.address}</Text>
            <Text>contacte: {item.num_telephone}</Text>
          </View>
        </TouchableOpacity>}
        contentContainerStyle={styles.flatlistContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  pharmacyButton: {
    borderRadius: 8,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    gap: 5,
    backgroundColor: "#e6fbf6"
  },
  pharmacyDetails: {
    display: "flex",
    flexDirection: "column",
    gap: 5
  },
  pharmacyName: {
    fontSize: 16
  },
  flatlistContainer: {
    gap: 20
  }
})

export default index;