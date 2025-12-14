"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const leagues_controller_1 = require("../controllers/leagues.controller");
const router = (0, express_1.Router)();
router.get("/:leagueId/overview", auth_1.requireAuth, leagues_controller_1.getLeagueOverview);
exports.default = router;
