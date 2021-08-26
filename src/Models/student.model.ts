import * as mongoose from 'mongoose';

export const StudentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  classgroup: String,
  userId:String,
  password:String,
  gender:String,
});

export interface Student extends mongoose.Document{
  name:string,
  age:number,
  classgroup:string,
  password:string,
  userId:string,
  gender:string,
}