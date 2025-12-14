"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeamOverview = getTeamOverview;
exports.getTeamStats = getTeamStats;
const teamsService = __importStar(require("../services/teams.service"));
async function getTeamOverview(req, res, next) {
    try {
        const teamId = Number(req.params.teamId);
        const leagueId = req.query.league ? Number(req.query.league) : undefined;
        const season = req.query.season ? Number(req.query.season) : undefined;
        if (!teamId || !leagueId || !season) {
            return res.status(400).json({
                status: "fail",
                message: "Paramètres manquants (teamId, league, season).",
            });
        }
        const overview = await teamsService.getTeamOverview({
            teamId,
            leagueId,
            season,
        });
        return res.status(200).json({
            status: "success",
            data: overview,
        });
    }
    catch (err) {
        next(err);
    }
}
async function getTeamStats(req, res, next) {
    try {
        const teamName = req.query.team;
        const season = req.query.season ? Number(req.query.season) : undefined;
        if (!teamName || !season) {
            return res.status(400).json({
                status: "fail",
                message: "Paramètres manquants (team, season).",
            });
        }
        const stats = await teamsService.getTeamStats({
            teamName,
            season,
        });
        return res.status(200).json({
            status: "success",
            data: stats,
        });
    }
    catch (err) {
        return res.status(404).json({
            status: "fail",
            message: err.message || "Erreur lors de la récupération des statistiques",
        });
    }
}
