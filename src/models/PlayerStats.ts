import mongoose, { Schema, Document } from 'mongoose';

export interface IPlayerStats extends Document {
  player: mongoose.Types.ObjectId; 
  goals: number;    
  minutes: number;  
  season: number;
  team: mongoose.Types.ObjectId;
  league: mongoose.Types.ObjectId;
}

const PlayerStatsSchema: Schema = new Schema({
  player: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  goals: { type: Number, required: true, default: 0 },
  minutes: { type: Number, required: true, default: 0 },
  season: { type: Number, required: true },
  team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  league: { type: Schema.Types.ObjectId, ref: 'League', required: true }
});

PlayerStatsSchema.index({ player: 1, season: 1, team: 1 }, { unique: true });

export default mongoose.model<IPlayerStats>('PlayerStats', PlayerStatsSchema);