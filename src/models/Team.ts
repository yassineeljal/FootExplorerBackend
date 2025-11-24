import {Document, Schema, Model} from 'mongoose';
import mongoose from 'mongoose';

export interface ITeam extends Document {
    id: number;
    name: string ;
    logo: string ;
    founded: number ;
    stade_name: string ;
}

const TeamSchema: Schema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    logo: { type: String, required: true },
    founded: { type: Number, required: true },
    stade_name: { type: String, required: true },
}, {
    timestamps: true,
});
const Team: Model<ITeam> = mongoose.model<ITeam>('Team', TeamSchema);

export default Team;