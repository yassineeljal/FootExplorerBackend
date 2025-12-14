"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const teams_controller_1 = require("../controllers/teams.controller");
const router = (0, express_1.Router)();
router.get("/stats", auth_1.requireAuth, teams_controller_1.getTeamStats);
router.get("/:teamId/overview", auth_1.requireAuth, teams_controller_1.getTeamOverview);
exports.default = router;
