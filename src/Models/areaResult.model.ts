import * as mongoose from 'mongoose';

export const AreaResultSchema = new mongoose.Schema({
    sesionId: String,
    area: String,
    aciertos: String,
    preguntas: Number,
    tiempo: Number
});

export interface AreaResult extends mongoose.Document{
    sesionId: string,
    area: string,
    aciertos: string,
    preguntas: number,
    tiempo: number
}

