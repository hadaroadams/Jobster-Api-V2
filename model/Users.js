const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "first name is required"],
    trim: true,
    maxLength: 30,
    minLength: 3,
  },
  lastName: {
    type: String,
    required: [true, "first name is required"],
    trim: true,
    maxLength: 30,
    minLength: 3,
  },
  location: {
    type: String,
    maxLength: 20,
    trim: true,
    default: "my city",
  },
  email: {
    type: String,
    require: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    require: [true, "Please provide password"],
    minLength: 6,
  },
});

UserSchema.pre("save", async function () {
  if (this.password.isModifed()) return;
  console.log(this);
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log(this.password);
});

UserSchema.methods.createJWt = function () {
  return jwt.sign(
    { userID: this._id, name: this.firstName },
    process.env.JWT.SECRETE.TOKEN,
    {
      expiresIn: "1d",
    }
  );
};

UserSchema.methods.comparePassword = async function (candidatesPassword) {
  return await bcrypt.compare(candidatesPassword, this.password);
};

module.exports = model("Users", UserSchema);
