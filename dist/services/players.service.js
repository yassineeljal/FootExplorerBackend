"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopPlayers = getTopPlayers;
exports.searchPlayers = searchPlayers;
exports.getPlayerStats = getPlayerStats;
const Player_1 = __importDefault(require("../models/Player"));
const PlayerStats_1 = __importDefault(require("../models/PlayerStats"));
const League_1 = __importDefault(require("../models/League"));
async function getTopPlayers(params) {
    const { leagueId, season } = params;
    const league = await League_1.default.findOne({ apiId: leagueId });
    if (!league) {
        return [];
    }
    const topStats = await PlayerStats_1.default.find({
        league: league._id,
        season: season,
    })
        .sort({ goals: -1 })
        .limit(20)
        .populate({
        path: "player",
        select: "apiId name photo firstname lastname",
    })
        .populate({
        path: "team",
        select: "apiId name logo",
    })
        .lean();
    return topStats.map((stats) => ({
        player: {
            id: stats.player.apiId,
            name: stats.player.name,
            photo: stats.player.photo,
            firstname: stats.player.firstname,
            lastname: stats.player.lastname,
        },
        statistics: [
            {
                team: {
                    id: stats.team.apiId,
                    name: stats.team.name,
                    logo: stats.team.logo,
                },
                games: {
                    rating: stats.rating,
                },
                goals: {
                    total: stats.goals,
                },
            },
        ],
    }));
}
async function searchPlayers(query) {
    const lowerQuery = query.toLowerCase();
    const players = await Player_1.default.find({
        name: lowerQuery,
    })
        .limit(10)
        .lean();
    return players;
}
async function getPlayerStats(params) {
    const player = await Player_1.default.findOne({ apiId: params.playerId }).lean();
    if (!player)
        return null;
    const stats = await PlayerStats_1.default.find({
        player: player._id,
        season: params.season,
    })
        .populate({
        path: "team",
        select: "apiId name logo",
    })
        .populate({
        path: "league",
        select: "apiId name",
    })
        .lean();
    return {
        player: player,
        stats: stats,
    };
}
