import * as mongoose from 'mongoose';

export const SesionSchema = new mongoose.Schema({
  sesion_id: String,
  student: String,
  tipo: Number,
  fecha: String
});

export interface Sesion extends mongoose.Document{
    sesion_id: string,
    student: string
    tipo: number,
    fecha: string
}