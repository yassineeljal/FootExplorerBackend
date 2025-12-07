import { UserModel, IUser } from "../models/User";
import PlayerModel from "../models/Player"; 
import TeamModel from "../models/Team";
import LeagueModel from "../models/League";

export async function getMeService(userId: string): Promise<Partial<IUser> | null> {
    return UserModel.findById(userId).select("-password").lean();
}

export async function patchMeService(userId: string, data: any): Promise<{ user: Partial<IUser> } | { error: { status: number, message: string } }> {
    const user = await UserModel.findByIdAndUpdate(userId, data, { new: true, runValidators: true }).select("-password").lean();

    if (!user) {
        return { error: { status: 404, message: "Utilisateur non trouvé" } };
    }
    
    return { user: user as Partial<IUser> };
}

export async function getByIdAdminService(userId: string): Promise<Partial<IUser> | null> {
    return UserModel.findById(userId).select("-password").lean();
}


export async function manageFavoriteService(userId: string, type: 'player' | 'team' | 'league', apiId: number, action: 'add' | 'remove') {
    
    const fieldMap: any = {
        'player': 'favoritePlayers',
        'team': 'favoriteTeams',
        'league': 'favoriteLeagues'
    };
    
    const field = fieldMap[type];
    if (!field) throw new Error("Type de favori invalide (attendu: player, team, league)");

    const updateQuery = action === 'add' 
        ? { $addToSet: { [field]: apiId } } 
        : { $pull: { [field]: apiId } };    

    await UserModel.findByIdAndUpdate(userId, updateQuery);
    
    return { success: true, message: `Favori ${action}é avec succès` };
}


export async function getMyFavoritesService(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) return null;

    const players = await PlayerModel.find({ apiId: { $in: user.favoritePlayers } });
    const teams = await TeamModel.find({ apiId: { $in: user.favoriteTeams } });
    const leagues = await LeagueModel.find({ apiId: { $in: user.favoriteLeagues } });

    return {
        players,
        teams,
        leagues
    };
}