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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./app/config/env");
const adminSeed_1 = require("./app/utils/adminSeed");
let server;
// 👉 Handle sync errors first
process.on("uncaughtException", (err) => {
    console.log("Uncaught exception detected...server shutting down", err);
    process.exit(1); // No need to call server.close(), server might not even be running
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(env_1.envVars.DB_URL);
        server = app_1.default.listen(env_1.envVars.PORT, () => {
            console.log(`Server is running on port ${env_1.envVars.PORT}`);
        });
    }
    catch (error) {
        console.log(error);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    main();
    (0, adminSeed_1.adminSeed)();
}))();
// 👉 Handle async promise rejections
process.on("unhandledRejection", (err) => {
    console.log("Unhandled rejection detected...server shutting down", err);
    if (server) {
        server.close(() => __awaiter(void 0, void 0, void 0, function* () {
            yield mongoose_1.default.disconnect();
            process.exit(1);
        }));
    }
});
// 👉 Graceful shutdown on termination signals
process.on("SIGTERM", () => {
    console.log("SIGTERM received...server shutting down");
    if (server) {
        server.close(() => __awaiter(void 0, void 0, void 0, function* () {
            yield mongoose_1.default.disconnect();
            process.exit(0);
        }));
    }
});
process.on("SIGINT", () => {
    console.log("SIGINT signal received...server shutting down");
    if (server) {
        server.close(() => __awaiter(void 0, void 0, void 0, function* () {
            yield mongoose_1.default.disconnect();
            process.exit(0);
        }));
    }
});
