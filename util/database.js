import * as SQLite from "expo-sqlite";
import { Place } from "../models/place";

const db = SQLite.openDatabaseSync("places.db");

export async function init() {
  const result = await db.execAsync(
    `CREATE TABLE IF NOT EXISTS places (
                  id INTEGER PRIMARY KEY NOT NULL,
                  title TEXT NOT NULL,
                  imageUri TEXT NOT NULL,
                  address TEXT NOT NULL,
                  lat REAL NOT NULL,
                  lng REAL NOT NULL
              );`
  );
  return result;
}

export async function insertPlace(place) {
  const result = await db.runAsync(
    `INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?)`,
    [
      place.title,
      place.imageUri,
      place.address,
      place.location.lat,
      place.location.lng,
    ]
  );
  return result;
}

export async function fetchPlaces() {
  const result = await db.getAllAsync(`SELECT * FROM places`);
  const places = [];
  for (const dp of result) {
    places.push(
      new Place(
        dp.title,
        dp.imageUri,
        {
          address: dp.address,
          lat: dp.lat,
          lng: dp.lng,
        },
        dp.id
      )
    );
  }
  return places;
}

export async function fetchPlaceDetails(id) {
  const result = await db.getFirstAsync(`SELECT * FROM places  WHERE id = ?`, [
    id,
  ]);
  const place = new Place(
    result.title,
    result.imageUri,
    {
      address: result.address,
      lat: result.lat,
      lng: result.lng,
    },
    result.id
  );
  return place;
}
