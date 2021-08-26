import * as mongoose from 'mongoose';

export const ClassgroupSchema = new mongoose.Schema({
  name: String,
  code: String,
  teacher: String,
  grade: Number,
});

export interface Classgroup extends mongoose.Document{
    name: string,
    code: string,
    teacher: string,
    grade: number,
}