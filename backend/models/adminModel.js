import mongoose from "mongoose";

const adminSchema = mongoose.Schema(

{
  name: {
     type: String,
     required: true
  },
  uname: {
    type: String,
    required: true
 },
 password: {
    type: String,
    required: true
 },
 email: {
    type: String,
    required: true
 }

}

);

export const Admin = mongoose.model('admint',adminSchema);