import mongoose, { Schema, Document } from 'mongoose';

export interface IStanding extends Document {
  team: mongoose.Types.ObjectId;
  rank: number;    
  points: number;  
  league: mongoose.Types.ObjectId;
  season: number;
}

const StandingSchema: Schema = new Schema({
  team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  rank: { type: Number, required: true },
  points: { type: Number, required: true },
  league: { type: Schema.Types.ObjectId, ref: 'League', required: true },
  season: { type: Number, required: true }
});

StandingSchema.index({ team: 1, league: 1, season: 1 }, { unique: true });

export default mongoose.model<IStanding>('Standing', StandingSchema);