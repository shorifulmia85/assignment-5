"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressFromCoordinates = exports.getDistanceMatrix = void 0;
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const getDistanceMatrix = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const startLat = payload.pickup.lat;
    const startLng = payload.pickup.lng;
    const endLat = payload.destination.lat;
    const endLng = payload.destination.lng;
    try {
        const response = yield axios_1.default.post(env_1.envVars.HEIGIT_MATRIX_API, {
            locations: [
                [startLng, startLat],
                [endLng, endLat],
            ],
            metrics: ["distance", "duration"],
            units: "km",
        }, {
            headers: {
                Authorization: env_1.envVars.ORS_API_KEY,
                "Content-Type": "application/json",
                Accept: "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
            },
        });
        const distance = response.data.distances[0][1];
        const duration = response.data.durations[0][1];
        return { distance, duration };
    }
    catch (err) {
        console.error("Error:", ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
    }
});
exports.getDistanceMatrix = getDistanceMatrix;
const getAddressFromCoordinates = (lat, lng) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const response = yield axios_1.default.get(env_1.envVars.HEIGIT_REVERSE_API, {
            params: {
                api_key: env_1.envVars.ORS_API_KEY,
                "point.lat": lat,
                "point.lon": lng,
            },
            headers: {
                Accept: "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
            },
        });
        const place = response.data.features[0];
        return place.properties.label;
    }
    catch (error) {
        console.error("Reverse geocoding failed:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
    }
});
exports.getAddressFromCoordinates = getAddressFromCoordinates;
