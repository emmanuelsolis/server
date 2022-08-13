const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
   email: {
      type: String,
      unique: true, //[true, "Debes de usar oyto correo"]-> Ideally, should be unique, but its up to you
      required: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    //Es muy importante
    role:{
      type: String,
      enum: ["User", "Admin"],
      default: "User"
    },
    first_name:{
      type: String,
      minlength: 1,
    },
    last_name:{
      type: String,
      minlength: 1,
    },
    imageUrl:{
      type: String,
      default: "https://res.cloudinary.com/dhgfid3ej/image/upload/v1558806705/asdsadsa_iysw1l.jpg"
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
