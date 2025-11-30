import * as jwt from "jsonwebtoken";
import config from "config";
import { UserModel, IUser } from "../models/User";

type UserAuthResult = { user: Partial<IUser>, token: string };
type AuthError = { conflict: boolean } | { invalid: boolean };

const User = UserModel;

const secret = config.get<string>("security.jwt.secret") as jwt.Secret;
const expiresIn = config.get<string>("security.jwt.expiresIn");

export async function registerUser(data: { email: string; username: string; name: string; password: string }): Promise<UserAuthResult | AuthError> {
    const exists = await User.findOne({ 
        $or: [{ email: data.email }, { username: data.username }] 
    }).lean();
    if (exists) return { conflict: true as const };

    const user = await (User as any).create({
        email: data.email,
        username: data.username,
        password: data.password,
        name: data.name,
        role: "user",
    });

    const userInstance = user as any; 

    const token = jwt.sign(
        { sub: userInstance.id, role: userInstance.role },
        secret,
        { expiresIn } as jwt.SignOptions
    );

    const { password, ...safe } = userInstance.toObject();
    return { user: safe as Partial<IUser>, token };
}

export async function loginUser(data: { email?: string; username?: string; password: string }): Promise<UserAuthResult | AuthError> {
    
    const user = await User
        .findOne(data.email ? { email: data.email } : { username: data.username })
        .select('+password');

    if (!user) return { invalid: true as const };
    
    const ok = await (user as any).comparePassword(data.password);
    if (!ok) return { invalid: true as const };

    const userInstance = user as any; 

    const token = jwt.sign(
        { sub: userInstance.id, role: userInstance.role },
        secret,
        { expiresIn } as jwt.SignOptions
    );
    
    const { password, ...safe } = userInstance.toObject();
    return { user: safe as Partial<IUser>, token };
}


export function getMe(userId: string) {
    return User.findById(userId).select("-password").lean();
}
