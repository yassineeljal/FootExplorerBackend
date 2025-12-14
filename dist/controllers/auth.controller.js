"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.me = me;
const auth_service_1 = require("../services/auth.service");
async function register(req, res) {
    const { email, username, password, name } = req.body || {};
    if (!email || !username || !password || !name)
        return res
            .status(400)
            .json({ message: "Champs requis manquants", code: 400 });
    try {
        const result = await (0, auth_service_1.registerUser)({ email, username, name, password });
        if ("conflict" in result)
            return res
                .status(409)
                .json({ message: "Email/username déjà utilisé", code: 409 });
        return res.status(201).json(result);
    }
    catch (e) {
        return res.status(500).json({ message: e.message });
    }
}
async function login(req, res) {
    const { email, username, password } = req.body || {};
    if ((!email && !username) || !password)
        return res
            .status(400)
            .json({ message: "Identifiants requis manquants", code: 400 });
    try {
        const result = await (0, auth_service_1.loginUser)({ email, username, password });
        if ("invalid" in result)
            return res
                .status(401)
                .json({ message: "Identifiants invalides", code: 401 });
        return res.json(result);
    }
    catch (e) {
        return res.status(500).json({ message: e.message });
    }
}
async function me(req, res) {
    try {
        const user = await (0, auth_service_1.getMe)(req.user.sub);
        if (!user)
            return res.status(404).json({ message: "User not found", code: 404 });
        res.json({ user });
    }
    catch (e) {
        return res.status(500).json({ message: e.message });
    }
}
