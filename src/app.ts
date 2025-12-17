import express from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import config from "config";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/users.routes";
import teamRoutes from "./routes/teams.routes";
import playerRoutes from "./routes/players.routes";
import leagueRoutes from "./routes/leagues.routes";

import { logRequest, logError } from "./middlewares/logging";

const baseApi = config.get<string>("app.basePath");
const corsOrigins = config.get<string[]>("security.cors.origins");
const rateLimitConfig = config.get<{ windowMs: number; max: number }>(
    "security.rateLimit"
);

const app = express();

app.use(cors({ origin: corsOrigins }));

const limiter = rateLimit({
    windowMs: rateLimitConfig.windowMs,
    max: rateLimitConfig.max,
    message: "Trop de requêtes depuis cette IP, veuillez réessayer plus tard.",
});
app.use(baseApi, limiter);

app.use(logRequest);
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
    res.json({ message: "API opérationnelle" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(`${baseApi}/auth`, authRoutes);
app.use(`${baseApi}/users`, userRoutes);
app.use(`${baseApi}/teams`, teamRoutes);
app.use(`${baseApi}/players`, playerRoutes);
app.use(`${baseApi}/leagues`, leagueRoutes);

app.use((req, res, next) => {
    const error: any = new Error(
        `Impossible de trouver ${req.originalUrl} sur ce serveur`
    );
    error.status = 404;
    next(error);
});

app.use(logError);

export default app;
