"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeService = getMeService;
exports.patchMeService = patchMeService;
exports.getByIdAdminService = getByIdAdminService;
exports.manageFavoriteService = manageFavoriteService;
exports.getMyFavoritesService = getMyFavoritesService;
const User_1 = require("../models/User");
const Player_1 = __importDefault(require("../models/Player"));
const Team_1 = __importDefault(require("../models/Team"));
const League_1 = __importDefault(require("../models/League"));
async function getMeService(userId) {
    return User_1.UserModel.findById(userId).select("-password").lean();
}
async function patchMeService(userId, data) {
    const user = await User_1.UserModel.findByIdAndUpdate(userId, data, {
        new: true,
        runValidators: true,
    })
        .select("-password")
        .lean();
    if (!user) {
        return { error: { status: 404, message: "Utilisateur non trouvé" } };
    }
    return { user: user };
}
async function getByIdAdminService(userId) {
    return User_1.UserModel.findById(userId).select("-password").lean();
}
async function manageFavoriteService(userId, type, apiId, action) {
    const fieldMap = {
        player: "favoritePlayers",
        team: "favoriteTeams",
        league: "favoriteLeagues",
    };
    const field = fieldMap[type];
    if (!field)
        throw new Error("Type de favori invalide (attendu: player, team, league)");
    const user = await User_1.UserModel.findById(userId);
    if (!user)
        throw new Error("Utilisateur non trouvé");
    if (action === "add") {
        if (!user[field].includes(apiId)) {
            user[field].push(apiId);
        }
    }
    else {
        user[field] = user[field].filter((id) => id !== apiId);
    }
    await user.save();
    return { success: true, message: `Favori ${action}é avec succès` };
}
async function getMyFavoritesService(userId) {
    const user = await User_1.UserModel.findById(userId);
    if (!user)
        return null;
    const allPlayers = await Player_1.default.find();
    const allTeams = await Team_1.default.find();
    const allLeagues = await League_1.default.find();
    const players = allPlayers.filter(p => user.favoritePlayers.includes(p.apiId));
    const teams = allTeams.filter(t => user.favoriteTeams.includes(t.apiId));
    const leagues = allLeagues.filter(l => user.favoriteLeagues.includes(l.apiId));
    return {
        players,
        teams,
        leagues,
    };
}
