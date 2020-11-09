import * as mongoose from 'mongoose';

export const StudentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  userId:String,
  password:String
});

export interface Student extends mongoose.Document{
  name:string,
  age:number,
  password:string,
  userId:string
}