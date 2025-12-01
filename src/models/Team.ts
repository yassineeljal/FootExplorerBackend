import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
  apiId: number;
  name: string;
  code: string;
  country: string;
  founded: number;
  logo: string;
  venue_name: string;
  venue_capacity: number;
}

const TeamSchema: Schema = new Schema({
  apiId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  code: { type: String },
  country: { type: String },
  founded: { type: Number },
  logo: { type: String },
  venue: { type: String }

});

export default mongoose.model<ITeam>('Team', TeamSchema);