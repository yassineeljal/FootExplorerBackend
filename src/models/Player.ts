import {Document, Schema, Model} from 'mongoose';
import mongoose from 'mongoose';

export interface IPlayer extends Document {
    id: number ;
    name: string ;
    first_name: string ;
    last_name: string ;
    age: number ;
    birth_date: Date ;
    nationality: string ;
    photo: string ;
}
const PlayerSchema: Schema = new Schema({
    _id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    age: { type: Number, required: true },
    birth_date: { type: Date, required: true },
    nationality: { type: String, required: true },
    photo: { type: String, required: true },
}, {
    timestamps: true,
});
const Player: Model<IPlayer> = mongoose.model<IPlayer>('Player', PlayerSchema);

export default Player;