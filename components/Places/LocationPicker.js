import { useEffect, useState } from "react";
import { View, StyleSheet, Alert, Image, Text } from "react-native";
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
  reverseGeocodeAsync,
} from "expo-location";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";

import OutlinedButton from "../UI/OutlinedButton";
import { Colors } from "../../constants/colors";
import { getAddress, getMapPreview } from "../../util/location";
import MapView, { Marker } from "react-native-maps";

function LocationPicker({ onPickLocation }) {
  const [pickedLocation, setPickedLocation] = useState();
  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && route.params) {
      const mapPickedLocation = {
        lat: route.params.pickedLat,
        lng: route.params.pickedLng,
      };
      setPickedLocation(mapPickedLocation);
    }
  }, [route, isFocused]);

  useEffect(() => {
    async function handleLocation() {
      if (pickedLocation) {
        // const address = await getAddress(
        //   pickedLocation.lat,
        //   pickedLocation.lng
        // );
        const address = await reverseGeocodeAsync({
          latitude: pickedLocation.lat,
          longitude: pickedLocation.lng,
        });
        const { name, city, region, postalCode, isoCountryCode } = address[0];
        const formattedAddress = `${name}, ${city}, ${region} ${postalCode}, ${isoCountryCode}`;
        onPickLocation({ ...pickedLocation, address: formattedAddress });
      }
    }
    handleLocation();
  }, [pickedLocation, onPickLocation]);

  async function verifyPermissions() {
    if (
      locationPermissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (locationPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant location permissions to use this app."
      );
      return false;
    }

    return true;
  }

  async function getLocationHandler() {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) return;

    const location = await getCurrentPositionAsync();
    setPickedLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
  }

  function pickOnMapHandler() {
    navigation.navigate("Map");
  }

  let locationPreview = <Text>No location picked yet.</Text>;

  if (pickedLocation) {
    const region = {
      latitude: pickedLocation.lat,
      longitude: pickedLocation.lng,
      latitudeDelta: 0.004757,
      longitudeDelta: 0.006866,
    };

    locationPreview = (
      <MapView
        initialRegion={region}
        style={styles.map}
      >
        {pickedLocation && (
          <Marker
            title="Picked Location"
            coordinate={{
              latitude: pickedLocation.lat,
              longitude: pickedLocation.lng,
            }}
          />
        )}
      </MapView>
      // <Image
      //   style={styles.image}
      //   source={{
      //     uri: getMapPreview(pickedLocation.lat, pickedLocation.lng),
      //   }}
      // />
    );
  }

  return (
    <View>
      <View style={styles.mapPreview}>{locationPreview}</View>
      <View style={styles.actions}>
        <OutlinedButton
          icon="location"
          onPress={getLocationHandler}
        >
          Locate User
        </OutlinedButton>
        <OutlinedButton
          icon="map"
          onPress={pickOnMapHandler}
        >
          Pick on Map
        </OutlinedButton>
      </View>
    </View>
  );
}

export default LocationPicker;

const styles = StyleSheet.create({
  mapPreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
