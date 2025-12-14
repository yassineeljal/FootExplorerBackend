"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.logRequest = logRequest;
exports.logError = logError;
const winston_1 = __importDefault(require("winston"));
const node_fs_1 = require("node:fs");
if (!(0, node_fs_1.existsSync)("logs"))
    (0, node_fs_1.mkdirSync)("logs", { recursive: true });
exports.logger = winston_1.default.createLogger({
    level: "info",
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
            level: "debug",
        }),
        new winston_1.default.transports.File({ filename: "logs/combined.log" }),
        new winston_1.default.transports.File({ filename: "logs/warn.log", level: "warn" }),
        new winston_1.default.transports.File({ filename: "logs/error.log", level: "error" }),
    ],
});
function logRequest(req, res, next) {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        const entry = `${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`;
        const level = res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";
        exports.logger.log({
            level,
            message: entry,
            duration: `${duration}ms`,
            statusCode: res.statusCode,
        });
    });
    next();
}
function logError(err, _req, res, _next) {
    exports.logger.error(err?.message || "Internal error", {
        stack: err?.stack,
        status: err?.status || 500,
    });
    res.status(err?.status || 500).json({
        error: err?.message || "Erreur interne",
        code: err?.status || 500,
    });
}
