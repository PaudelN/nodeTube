import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudinary url
      required: true,
    },
    coverImage: {
      type: String, //cloudinary url
    },
    watchHistory: [
      //refrence to videos model
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//Hashing the password and checking if it is password which is being modified instead of changing password everytime user saves anything.
//pre hook from mongoose executes before an event like save,remove,updateOne etc.allows us to modify, validate, or perform actions before saving or updating documents in MongoDB.
//do not use arrow function in this below case as arrow function do not have "this" reference,hence outer values from userSchema cannot be accessed as it will not know the outer scoped context. So better to use function().
//This kind of cryptographic based dependencies such as bcrypt and jwt takes some time to acheive a particular functionality, hence better to use async-await for code enhancement.
//Hence this is a middleware,we must write next to pass the flag forward,which indicates the completing of token generation

userSchema.pre("save", async function (next) {
  //isModified Prevents re-hashing an already hashed password if the user updates other fields (like email or username).
  //Password inside the isModified method should be passed as a string otherwise it will not work or throw an error.
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password, 10);
  next();
});

//Checking if the user entered password match with the database's password
//this function is used to check wheather the encrypted user's password and the password user is entering is same or not
//This is done by using methods method in mongoose which allows to pass any other methods inside of it.

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//Generating access token for authorization
//This both are jwt tokens created for two different purposes
//This token is sent in headers
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

//Generation of refresh tokens for generating a new access token when old one expires
//This token is sent to servers
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
export const User = mongoose.model("User", userSchema);
