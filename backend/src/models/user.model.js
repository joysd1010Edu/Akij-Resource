const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { USER_ROLES, USER_STATUS } = require("../utils/enums");

const userSchema = new mongoose.Schema(
  {
    ref_id: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      index: true,
    },
    full_name: {
      type: String,
      required: [true, "full_name is required"],
      trim: true,
      maxlength: 160,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
      index: true,
    },
    user_id_login: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      index: true,
    },
    password_hash: {
      type: String,
      required: [true, "password_hash is required"],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "student",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: USER_STATUS,
      default: "active",
      index: true,
    },
    profile_image: {
      type: String,
      trim: true,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    last_login_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  },
);

userSchema.methods.comparePassword = function comparePassword(plainPassword) {
  return bcrypt.compare(plainPassword, this.password_hash);
};

userSchema.methods.setPassword = async function setPassword(plainPassword) {
  this.password_hash = await bcrypt.hash(plainPassword, 12);
};

userSchema.statics.hashPassword = function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, 12);
};

userSchema.pre("save", async function hashPasswordOnSave(next) {
  if (!this.isModified("password_hash")) {
    return next();
  }

  if (
    typeof this.password_hash === "string" &&
    this.password_hash.startsWith("$2")
  ) {
    return next();
  }

  this.password_hash = await bcrypt.hash(this.password_hash, 12);
  return next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
