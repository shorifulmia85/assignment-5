"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFare = void 0;
const getFare = (payload) => {
    const baseFare = 50;
    const perkmFare = 20;
    const perMinFare = 2;
    const journeyMin = payload.duration / 60;
    const total = baseFare + (payload === null || payload === void 0 ? void 0 : payload.distance) * perkmFare + journeyMin * perMinFare;
    return Number(total.toFixed(2));
};
exports.getFare = getFare;
