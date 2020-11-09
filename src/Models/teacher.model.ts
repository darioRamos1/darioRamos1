import * as mongoose from 'mongoose';

export const TeacherSchema = new mongoose.Schema({
  name: String,
  userId:String,
  password:String
});

export interface Teacher extends mongoose.Document{
  name:string,
  password:string,
  userId:string
}