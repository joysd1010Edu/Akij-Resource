/* ==========  backend/src/models/testQuestionSet.model.js  ===============*/
const mongoose = require("mongoose");

const { ACTIVE_STATUS } = require("../utils/enums");

const testQuestionSetSchema = new mongoose.Schema(
  {
    test_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: [true, "test_id is required"],
      index: true,
    },
    set_name: {
      type: String,
      required: [true, "set_name is required"],
      trim: true,
      maxlength: 80,
    },
    set_no: {
      type: Number,
      required: [true, "set_no is required"],
      min: 1,
    },
    total_questions: {
      type: Number,
      default: 0,
      min: 0,
    },
    total_marks: {
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

testQuestionSetSchema.index({ test_id: 1, set_no: 1 }, { unique: true });

testQuestionSetSchema.index({ test_id: 1, set_name: 1 }, { unique: true });

const TestQuestionSet = mongoose.model(
  "TestQuestionSet",
  testQuestionSetSchema,
);

module.exports = TestQuestionSet;
