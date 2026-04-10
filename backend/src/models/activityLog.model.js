/* ==========  backend/src/models/activityLog.model.js  ===============*/
const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user_id is required"],
      index: true,
    },
    entity_type: {
      type: String,
      required: [true, "entity_type is required"],
      trim: true,
      maxlength: 120,
      index: true,
    },
    entity_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "entity_id is required"],
      index: true,
    },
    action: {
      type: String,
      required: [true, "action is required"],
      trim: true,
      maxlength: 120,
      index: true,
    },
    description: {
      type: String,
      default: "",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  },
);

activityLogSchema.index({ user_id: 1, created_at: -1 });
activityLogSchema.index({ entity_type: 1, entity_id: 1, created_at: -1 });

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

module.exports = ActivityLog;
