import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string;
  username: string;
  name: string;
  password: string;
  comparePassword: (p: string) => Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    name:     { type: String, required: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false } 
  },
  { timestamps: true }
);

UserSchema.pre("save", async function(){
  const u = this as IUser;
  if (!u.isModified("password")) return;
  
  try {
      const salt = await bcrypt.genSalt(10);
      u.password = await bcrypt.hash(u.password, salt);
  } catch (error) {
      throw new Error("Erreur lors du hachage du mot de passe.");
  }
});

UserSchema.methods.comparePassword = function(p: string) {
  return bcrypt.compare(p, (this as IUser).password);
};

export const UserModel = model<IUser>("User", UserSchema);