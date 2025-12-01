"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const HOST = process.env.HOST || '0.0.0.0';
const start = async () => {
    try {
        await server_1.default.listen({ port: PORT, host: HOST });
        console.log(`🚀 API server running on http://${HOST}:${PORT}`);
        console.log(`📊 Health check: http://${HOST}:${PORT}/health`);
    }
    catch (err) {
        server_1.default.log.error(err);
        process.exit(1);
    }
};
start();
