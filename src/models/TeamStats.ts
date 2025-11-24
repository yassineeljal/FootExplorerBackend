import {Document, Schema, Model} from 'mongoose';
import mongoose from 'mongoose';
export interface ITeamStats extends Document {
    team: number ;
    league: number ;
    season: number ;
    form: string ;
    fixtures: {
        played: { home: number ; away: number ; total: number } ;
        wins: { home: number ; away: number ; total: number } ;
        draws: { home: number ; away: number ; total: number } ;
        loses: { home: number ; away: number ; total: number } ;
    } ;
    goals: {
        for: {
            total: { home: number ; away: number ; total: number } ;
            average: { home: string ; away: string ; total: string } ;
        } ;
        against: {
            total: { home: number ; away: number ; total: number } ;
            average: { home: string ; away: string ; total: string } ;
        } ;
    } ;
    lineups: {
        formation: string ;
        played: number ;
    }[] ;
}


const TeamStatsSchema: Schema<ITeamStats> = new Schema({
  team: { type: Number, ref: 'Team', required: true },
  league: { type: Number, ref: 'League', required: true },
  season: { type: Number, required: true },
    form: String, 

  fixtures: {
    played: { home: Number, away: Number, total: Number },
    wins:   { home: Number, away: Number, total: Number },
    draws:  { home: Number, away: Number, total: Number },
    loses:  { home: Number, away: Number, total: Number }
  },

  goals: {
    for: {
      total: { home: Number, away: Number, total: Number },
      average: { home: String, away: String, total: String }
    },
    against: {
      total: { home: Number, away: Number, total: Number },
      average: { home: String, away: String, total: String }
    }
  },

  lineups: [{
    formation: String,
    played: Number     }]

}, {  timestamps: true});

const TeamStats: Model<ITeamStats> = mongoose.model<ITeamStats>('TeamStats', TeamStatsSchema);

export default TeamStats;