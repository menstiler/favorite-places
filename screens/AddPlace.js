import PlaceForm from "../components/Places/PlaceForm";
import { insertPlace } from "../util/database";

function AddPlace({ navigation }) {
  async function addPlaceHandler(place) {
    try {
      await insertPlace(place);
      navigation.navigate("AllPlaces");
    } catch (error) {
      console.error(error);
    }
  }

  return <PlaceForm onCreatePlace={addPlaceHandler} />;
}
export default AddPlace;
