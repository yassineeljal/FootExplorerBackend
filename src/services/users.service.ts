import { UserModel, IUser } from "../models/User";

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