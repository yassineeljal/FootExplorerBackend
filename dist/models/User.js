"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    favoriteLeagues: { type: [Number], default: [] },
    favoriteTeams: { type: [Number], default: [] },
    favoritePlayers: { type: [Number], default: [] },
}, { timestamps: true });
UserSchema.pre("save", async function () {
    const u = this;
    if (!u.isModified("password"))
        return;
    try {
        const salt = await bcryptjs_1.default.genSalt(10);
        u.password = await bcryptjs_1.default.hash(u.password, salt);
    }
    catch (error) {
        throw new Error("Erreur lors du hachage du mot de passe.");
    }
});
UserSchema.methods.comparePassword = function (p) {
    return bcryptjs_1.default.compare(p, this.password);
};
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
