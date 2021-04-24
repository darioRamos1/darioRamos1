import * as mongoose from 'mongoose';

export const SesionSchema = new mongoose.Schema({
  student: String,
  tipo: Number,
  fecha: String,
  estado: Boolean
});

export interface Sesion extends mongoose.Document{
    student: string
    tipo: number,
    fecha: string
    estado: boolean
}