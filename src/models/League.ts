import mongoose, { Schema, Document } from 'mongoose';

export interface ILeague extends Document {
  apiId: number;
  name: string;
  country: string;
  logo: string;
  season: number;
}

const LeagueSchema: Schema = new Schema({
  apiId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  country: { type: String },
  logo: { type: String },
  season: { type: Number }
});

export default mongoose.model<ILeague>('League', LeagueSchema);