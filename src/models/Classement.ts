import {Document, Schema, Model, } from 'mongoose';
import mongoose from 'mongoose';

export interface IClassement extends Document {
    rank: number ;
    team_id: number ;
    league_id: number ;
    points: number ;
    goalsDiff: number ;
    description?: string ;
}



const ClassementSchema: Schema<IClassement> = new Schema({
    rank: { type: Number, required: true },
    team_id: { type: Number, ref: 'Team', required: true },
    league_id: { type: Number, ref: 'League', required: true },
    points: { type: Number, required: true },
    goalsDiff: { type: Number, required: true },
    description: { type: String, required: false },
}, { timestamps: true });

