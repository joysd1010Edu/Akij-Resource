/* ==========  backend/src/models/testCandidate.model.js  ===============*/
const mongoose = require("mongoose");

const { ATTENDANCE_STATUS } = require("../utils/enums");

const testCandidateSchema = new mongoose.Schema(
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
    candidate_serial: {
      type: Number,
      min: 1,
      default: null,
    },
    attendance_status: {
      type: String,
      enum: ATTENDANCE_STATUS,
      default: "not_started",
      index: true,
    },
    is_eligible: {
      type: Boolean,
      default: true,
    },
    assigned_at: {
      type: Date,
      default: Date.now,
    },
    started_at: {
      type: Date,
      default: null,
    },
    submitted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  },
);

testCandidateSchema.index({ test_id: 1, student_id: 1 }, { unique: true });
testCandidateSchema.index(
  { test_id: 1, slot_id: 1, candidate_serial: 1 },
  { unique: true, sparse: true },
);

const TestCandidate = mongoose.model("TestCandidate", testCandidateSchema);

module.exports = TestCandidate;
