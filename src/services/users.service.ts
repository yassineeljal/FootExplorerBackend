import { UserModel, IUser } from "../models/User";
import PlayerModel from "../models/Player";
import TeamModel from "../models/Team";
import LeagueModel from "../models/League";

export async function getMeService(
  userId: string
): Promise<Partial<IUser> | null> {
  return UserModel.findById(userId).select("-password").lean();
}

export async function patchMeService(
  userId: string,
  data: any
): Promise<
  { user: Partial<IUser> } | { error: { status: number; message: string } }
> {
  const user = await UserModel.findByIdAndUpdate(userId, data, {
    new: true,
    runValidators: true,
  })
    .select("-password")
    .lean();

  if (!user) {
    return { error: { status: 404, message: "Utilisateur non trouvé" } };
  }

  return { user: user as Partial<IUser> };
}

export async function getByIdAdminService(
  userId: string
): Promise<Partial<IUser> | null> {
  return UserModel.findById(userId).select("-password").lean();
}

export async function manageFavoriteService(
  userId: string,
  type: "player" | "team" | "league",
  apiId: number,
  action: "add" | "remove"
) {
  const fieldMap: Record<string, "favoritePlayers" | "favoriteTeams" | "favoriteLeagues"> = {
    player: "favoritePlayers",
    team: "favoriteTeams",
    league: "favoriteLeagues",
  };

  const field = fieldMap[type];
  if (!field)
    throw new Error("Type de favori invalide (attendu: player, team, league)");

  const user = await UserModel.findById(userId);
  if (!user) throw new Error("Utilisateur non trouvé");

  if (action === "add") {
    if (!user[field].includes(apiId)) {
      user[field].push(apiId);
    }
  } else {
    user[field] = user[field].filter((id: number) => id !== apiId);
  }

  await user.save();

  return { success: true, message: `Favori ${action}é avec succès` };
}

export async function getMyFavoritesService(userId: string) {
  const user = await UserModel.findById(userId);
  if (!user) return null;

  const allPlayers = await PlayerModel.find();
  const allTeams = await TeamModel.find();
  const allLeagues = await LeagueModel.find();

  const players = allPlayers.filter(p => user.favoritePlayers.includes(p.apiId));
  const teams = allTeams.filter(t => user.favoriteTeams.includes(t.apiId));
  const leagues = allLeagues.filter(l => user.favoriteLeagues.includes(l.apiId));

  return {
    players,
    teams,
    leagues,
  };
}
