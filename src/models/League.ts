import {Document, Schema, Model} from 'mongoose';
import mongoose from 'mongoose';

export interface ILeague extends Document {
    id: number ;
    name: string ;
    country: string ;
    logo: string ;
    season: number ;
}

const LeagueSchema: Schema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    country: { type: String, required: true },
    logo: { type: String, required: true },
    season: { type: Number, required: true },
}, {
    timestamps: true,
});

const League: Model<ILeague> = mongoose.model<ILeague>('League', LeagueSchema);

export default League;