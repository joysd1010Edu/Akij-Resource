const mongoose = require("mongoose");

const { ACTIVE_STATUS } = require("../utils/enums");

const testSlotSchema = new mongoose.Schema(
  {
    test_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: [true, "test_id is required"],
      index: true,
    },
    slot_no: {
      type: Number,
      required: [true, "slot_no is required"],
      min: 1,
    },
    start_time: {
      type: Date,
      required: [true, "start_time is required"],
    },
    end_time: {
      type: Date,
      required: [true, "end_time is required"],
      validate: {
        validator(value) {
          return !this.start_time || value > this.start_time;
        },
        message: "end_time must be greater than start_time",
      },
    },
    duration_minutes: {
      type: Number,
      required: [true, "duration_minutes is required"],
      min: 1,
    },
    candidate_limit: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ACTIVE_STATUS,
      default: "active",
      index: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  },
);

testSlotSchema.index({ test_id: 1, slot_no: 1 }, { unique: true });

const TestSlot = mongoose.model("TestSlot", testSlotSchema);

module.exports = TestSlot;
