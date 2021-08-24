import * as mongoose from 'mongoose';

export const GeneralAreaSchema = new mongoose.Schema({
    area: String,
    media: Number,
    dt: Number,
    grado: Number,
    genero: String,
    tiempo: Number,
    numero: Number
});

export interface GeneralArea extends mongoose.Document {
    area: string,
    media: number,
    dt: number,
    grado: number,
    genero: string,
    tiempo: number,
    numero: number,
}