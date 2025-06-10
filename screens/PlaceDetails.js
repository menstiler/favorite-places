import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, Text, Image } from "react-native";
import OutlinedButton from "../components/UI/OutlinedButton";
import { Colors } from "../constants/colors";
import { fetchPlaceDetails } from "../util/database";

function PlaceDetails({ route, navigation }) {
  const [fetchedPlace, setFetchedPlace] = useState();
  const selectedPlaceId = route.params.placeId;

  useEffect(() => {
    async function loadPlace() {
      try {
        const place = await fetchPlaceDetails(selectedPlaceId);
        setFetchedPlace(place);
        navigation.setOptions({
          title: place.title,
        });
      } catch (error) {
        console.error(error);
      }
    }
    loadPlace();
  }, [selectedPlaceId, navigation, setFetchedPlace]);

  function showOnMapHandler() {
    navigation.navigate("Map", {
      initialLat: fetchedPlace.location.lat,
      initialLng: fetchedPlace.location.lng,
    });
  }

  if (!fetchedPlace) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>Loading place data...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Image
        style={styles.image}
        source={{ uri: fetchedPlace.imageUri }}
      />
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{fetchedPlace.address}</Text>
        </View>
        <OutlinedButton
          icon="map"
          onPress={showOnMapHandler}
        >
          View on Map
        </OutlinedButton>
      </View>
    </ScrollView>
  );
}

export default PlaceDetails;

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    color: "white",
  },
  image: {
    height: "35%",
    minHeight: 300,
    width: "100%",
  },
  locationContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  addressContainer: {
    padding: 20,
  },
  address: {
    color: Colors.primary500,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
