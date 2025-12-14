"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const secret = config_1.default.get("security.jwt.secret");
function requireAuth(req, res, next) {
    const h = req.headers.authorization;
    if (!h?.startsWith("Bearer "))
        return res.status(401).json({ message: "Token manquant", code: 401 });
    try {
        const payload = jsonwebtoken_1.default.verify(h.slice(7), secret);
        req.user = { sub: payload.sub };
        next();
    }
    catch (error) {
        return res
            .status(401)
            .json({ message: "Token invalide ou expiré", code: 401 });
    }
}
