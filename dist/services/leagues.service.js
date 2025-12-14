"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeagueOverview = getLeagueOverview;
const League_1 = __importDefault(require("../models/League"));
async function getLeagueOverview(params) {
    let league = await League_1.default.findOne({ apiId: params.leagueId }).lean();
    return league;
}
