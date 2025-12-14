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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getMe = getMe;
const jwt = __importStar(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const User_1 = require("../models/User");
const User = User_1.UserModel;
const secret = config_1.default.get("security.jwt.secret");
const expiresIn = config_1.default.get("security.jwt.expiresIn");
async function registerUser(data) {
    const exists = await User.findOne({
        $or: [{ email: data.email }, { username: data.username }]
    }).lean();
    if (exists)
        return { conflict: true };
    const user = await User.create({
        email: data.email,
        username: data.username,
        password: data.password,
        name: data.name,
        role: "user",
    });
    const userInstance = user;
    const token = jwt.sign({ sub: userInstance.id, role: userInstance.role }, secret, { expiresIn });
    const { password, ...safe } = userInstance.toObject();
    return { user: safe, token };
}
async function loginUser(data) {
    const user = await User
        .findOne(data.email ? { email: data.email } : { username: data.username })
        .select('+password');
    if (!user)
        return { invalid: true };
    const ok = await user.comparePassword(data.password);
    if (!ok)
        return { invalid: true };
    const userInstance = user;
    const token = jwt.sign({ sub: userInstance.id, role: userInstance.role }, secret, { expiresIn });
    const { password, ...safe } = userInstance.toObject();
    return { user: safe, token };
}
function getMe(userId) {
    return User.findById(userId).select("-password").lean();
}
