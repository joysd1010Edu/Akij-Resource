/* ==========  backend/src/models/testAttempt.model.js  ===============*/
const mongoose = require("mongoose");

const { ATTEMPT_STATUS } = require("../utils/enums");

const testAttemptSchema = new mongoose.Schema(
  {
    test_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: [true, "test_id is required"],
      index: true,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "student_id is required"],
      index: true,
    },
    slot_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestSlot",
      required: [true, "slot_id is required"],
      index: true,
    },
    question_set_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestQuestionSet",
      required: [true, "question_set_id is required"],
      index: true,
    },
    attempt_no: {
      type: Number,
      default: 1,
      min: 1,
    },
    started_at: {
      type: Date,
      required: [true, "started_at is required"],
    },
    submitted_at: {
      type: Date,
      default: null,
    },
    time_spent_seconds: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ATTEMPT_STATUS,
      default: "in_progress",
      index: true,
    },
    current_question_no: {
      type: Number,
      default: 1,
      min: 1,
    },
    total_questions: {
      type: Number,
      default: 0,
      min: 0,
    },
    answered_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    skipped_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    auto_submitted: {
      type: Boolean,
      default: false,
    },
    total_marks: {
      type: Number,
      default: 0,
      min: 0,
    },
    obtained_marks: {
      type: Number,
      default: 0,
      min: 0,
    },
    correct_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    wrong_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    text_pending_review_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    device_info: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  },
);

testAttemptSchema.index(
  { test_id: 1, student_id: 1, attempt_no: 1 },
  { unique: true },
);
testAttemptSchema.index({ test_id: 1, slot_id: 1, status: 1 });

const TestAttempt = mongoose.model("TestAttempt", testAttemptSchema);

module.exports = TestAttempt;
