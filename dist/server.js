"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("config"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const teams_routes_1 = __importDefault(require("./routes/teams.routes"));
const players_routes_1 = __importDefault(require("./routes/players.routes"));
const leagues_routes_1 = __importDefault(require("./routes/leagues.routes"));
const logging_1 = require("./middlewares/logging");
const baseApi = config_1.default.get("app.basePath");
const corsOrigins = config_1.default.get("security.cors.origins");
const rateLimitConfig = config_1.default.get("security.rateLimit");
const dbUri = config_1.default.get("db.uri");
const port = config_1.default.get("server.http.port");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: corsOrigins }));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: rateLimitConfig.windowMs,
    max: rateLimitConfig.max,
    message: "Trop de requêtes depuis cette IP, veuillez réessayer plus tard.",
});
app.use(baseApi, limiter);
app.use(logging_1.logRequest);
app.use(express_1.default.json({ limit: "10kb" }));
app.get("/", (req, res) => {
    res.json({ message: "API opérationnelle" });
});
app.use(`${baseApi}/auth`, auth_routes_1.default);
app.use(`${baseApi}/users`, users_routes_1.default);
app.use(`${baseApi}/teams`, teams_routes_1.default);
app.use(`${baseApi}/players`, players_routes_1.default);
app.use(`${baseApi}/leagues`, leagues_routes_1.default);
app.use((req, res, next) => {
    const error = new Error(`Impossible de trouver ${req.originalUrl} sur ce serveur`);
    error.status = 404;
    next(error);
});
app.use(logging_1.logError);
const connectionOptions = {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 30000,
    family: 4,
};
console.log(`Connexion à MongoDB à : ${dbUri}`);
mongoose_1.default
    .connect(dbUri, connectionOptions)
    .then(() => {
    console.log("Connexion MongoDB réussie.");
    app.listen(port, () => {
        console.log(`Serveur démarré sur le port ${port}`);
        console.log(`Chemin de base API : http://localhost:${port}${config_1.default.get("app.basePath")}`);
    });
})
    .catch((err) => {
    console.error("ERREUR FATALE DE CONNEXION BD. Le serveur NE démarre PAS.");
    console.error(`Détails de l'erreur : ${err.message}`);
    process.exit(1);
});
process.on("unhandledRejection", (err) => {
    console.log("REJET NON GÉRÉ ! Extinction...");
    console.error(err.name, err.message);
    process.exit(1);
});
