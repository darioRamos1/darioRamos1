import * as mongoose from 'mongoose';

export const ActivityResultSchema = new mongoose.Schema({
    sesionId: String,
    area: String,
    resultado: Boolean,
    tiempo: Number,
    indice: Number
});

export interface ActivityResult extends mongoose.Document{
    sesionId: string,
    area: string,
    resultado: boolean,
    tiempo: number,
    indice: number
}