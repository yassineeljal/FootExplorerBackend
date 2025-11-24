import {Document, Schema, Model} from 'mongoose';
import mongoose from 'mongoose';
import Team from './Team';

export interface IPlayerStats extends Document {
    player_id: number ;
    team_id: number ;
    league_id: number ;
    season: number ;
    minute_Played: number ;
    position: string ;
    rating: number ;
    goals_total: number ;
    assists: number ;
    card_yellow: number ;
    card_red: number ;
}


const PlayerStatsSchema: Schema<IPlayerStats> = new Schema({
  player_id: { type: Number, ref: 'Player', required: true },
  team_id: { type: Number, ref: 'Team', required: true },
  league_id: { type: Number, ref: 'League', required: true },
  season: { type: Number, required: true },
  minute_Played: { type: Number, required: true },
  position: { type: String, required: true },
  rating: { type: Number, required: true },
  goals_total: { type: Number, required: true },
  assists: { type: Number, required: true },
  card_yellow: { type: Number, required: true },
  card_red: { type: Number, required: true },
}, { timestamps: true });



