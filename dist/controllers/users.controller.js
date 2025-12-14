"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = me;
exports.patchMe = patchMe;
exports.toggleFavorite = toggleFavorite;
exports.getFavorites = getFavorites;
const users_service_1 = require("../services/users.service");
async function me(req, res) {
    try {
        const user = await (0, users_service_1.getMeService)(req.user.sub);
        if (!user)
            return res.status(404).json({ message: "User not found", code: 404 });
        res.json({ user });
    }
    catch (e) {
        return res.status(500).json({ message: e.message });
    }
}
async function patchMe(req, res) {
    try {
        const result = await (0, users_service_1.patchMeService)(req.user.sub, req.body);
        const error = result.error;
        if (error)
            return res
                .status(error.status)
                .json({ message: error.message, code: error.status });
        res.json({ user: result.user });
    }
    catch (e) {
        return res.status(500).json({ message: e.message });
    }
}
async function toggleFavorite(req, res) {
    try {
        const { type, apiId, action } = req.body;
        // Validation basique
        if (!type || !apiId || !action) {
            return res
                .status(400)
                .json({ message: "Champs manquants. Requis: type, apiId, action." });
        }
        const result = await (0, users_service_1.manageFavoriteService)(req.user.sub, type, apiId, action);
        res.json(result);
    }
    catch (e) {
        return res.status(500).json({ message: e.message });
    }
}
async function getFavorites(req, res) {
    try {
        const data = await (0, users_service_1.getMyFavoritesService)(req.user.sub);
        if (!data)
            return res.status(404).json({ message: "Utilisateur introuvable" });
        res.json(data);
    }
    catch (e) {
        return res.status(500).json({ message: e.message });
    }
}
