import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamStats extends Document {
  team: mongoose.Types.ObjectId;
  league: mongoose.Types.ObjectId;
  season: number;
  wins: number;       
  goalsFor: number;  
  formation: string;  
}

const TeamStatsSchema: Schema = new Schema({
  team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  league: { type: Schema.Types.ObjectId, ref: 'League', required: true },
  season: { type: Number, required: true },
  wins: { type: Number, required: true },
  goalsFor: { type: Number, required: true },
  formation: { type: String, required: true }
});


TeamStatsSchema.index({ team: 1, league: 1, season: 1 }, { unique: true });

export default mongoose.model<ITeamStats>('TeamStats', TeamStatsSchema);