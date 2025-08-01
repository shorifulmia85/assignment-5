/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { envVars } from "../config/env";

interface IProps {
  pickup: {
    lat: number;
    lng: number;
  };
  destination: {
    lat: number;
    lng: number;
  };
}

export const getDistanceMatrix = async (payload: IProps) => {
  const startLat = payload.pickup.lat;
  const startLng = payload.pickup.lng;

  const endLat = payload.destination.lat;
  const endLng = payload.destination.lng;

  try {
    const response = await axios.post(
      envVars.HEIGIT_MATRIX_API,
      {
        locations: [
          [startLng, startLat],
          [endLng, endLat],
        ],
        metrics: ["distance", "duration"],
        units: "km",
      },
      {
        headers: {
          Authorization: envVars.ORS_API_KEY,
          "Content-Type": "application/json",
          Accept:
            "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
        },
      }
    );

    const distance = response.data.distances[0][1];
    const duration = response.data.durations[0][1];

    return { distance, duration };
  } catch (err: any) {
    console.error("Error:", err.response?.data || err.message);
  }
};

export const getAddressFromCoordinates = async (lat: number, lng: number) => {
  try {
    const response = await axios.get(envVars.HEIGIT_REVERSE_API, {
      params: {
        api_key: envVars.ORS_API_KEY,
        "point.lat": lat,
        "point.lon": lng,
      },
      headers: {
        Accept:
          "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
      },
    });

    const place = response.data.features[0];

    return place.properties.label;
  } catch (error: any) {
    console.error(
      "Reverse geocoding failed:",
      error.response?.data || error.message
    );
  }
};
