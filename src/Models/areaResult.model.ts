import * as mongoose from 'mongoose';

export const AreaResultSchema = new mongoose.Schema({
    sesionId: String,
    area: String,
    resultado: Number,
    tiempo: Number,
    preguntas: Number,
});

export interface AreaResult extends mongoose.Document{
    sesionId: string,
    area: string,
    resultado: number,
    tiempo: number,
    preguntas: number
}