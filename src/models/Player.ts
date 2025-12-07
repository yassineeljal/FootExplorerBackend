import mongoose, { Schema, Document } from 'mongoose';

export interface IPlayer extends Document {
  apiId: number;       
  name: string;        
  firstname: string;  
  lastname: string;    
  age: number;        
  birth: {            
    date: string;     
    place: string;     
    country: string;   
  };
  nationality: string; 
  photo: string; 
}

const PlayerSchema: Schema = new Schema({
  apiId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  firstname: { type: String },
  lastname: { type: String },
  age: { type: Number },
  birth: {
    date: { type: String },
    place: { type: String },
    country: { type: String }
  },
  nationality: { type: String },
  photo: { type: String }
});

export default mongoose.model<IPlayer>('Player', PlayerSchema);