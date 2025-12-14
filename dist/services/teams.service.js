"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeamOverview = getTeamOverview;
exports.getTeamStats = getTeamStats;
const Team_1 = __importDefault(require("../models/Team"));
const TeamStats_1 = __importDefault(require("../models/TeamStats"));
async function getTeamOverview(params) {
    const { teamId } = params;
    const team = await Team_1.default.findOne({ apiId: teamId }).lean();
    return team;
}
async function getTeamStats(params) {
    const { teamName, season } = params;
    const team = await Team_1.default.findOne({ name: teamName }).lean();
    if (!team) {
        throw new Error(`Équipe "${teamName}" non trouvée`);
    }
    const teamStats = await TeamStats_1.default.findOne({
        team: team._id,
        season: season,
    })
        .populate("team", "name logo")
        .populate("league", "name")
        .lean();
    if (!teamStats) {
        throw new Error(`Statistiques non trouvées pour ${teamName} en ${season}`);
    }
    return {
        team: teamStats.team,
        league: teamStats.league,
        season: teamStats.season,
        wins: teamStats.wins,
        goalsFor: teamStats.goalsFor,
        formation: teamStats.formation,
    };
}
