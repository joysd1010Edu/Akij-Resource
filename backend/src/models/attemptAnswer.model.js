/* ==========  backend/src/models/attemptAnswer.model.js  ===============*/
const mongoose = require("mongoose");

const { QUESTION_TYPES, REVIEW_STATUS } = require("../utils/enums");

const attemptAnswerSchema = new mongoose.Schema(
  {
    attempt_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestAttempt",
      required: [true, "attempt_id is required"],
      index: true,
    },
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
    question_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: [true, "question_id is required"],
      index: true,
    },
    question_type: {
      type: String,
      enum: QUESTION_TYPES,
      required: [true, "question_type is required"],
    },
    selected_option_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "QuestionOption",
      },
    ],
    text_answer_html: {
      type: String,
      default: null,
    },
    text_answer_plain: {
      type: String,
      default: null,
    },
    is_skipped: {
      type: Boolean,
      default: false,
    },
    is_correct: {
      type: Boolean,
      default: null,
    },
    obtained_marks: {
      type: Number,
      default: 0,
    },
    negative_marks_applied: {
      type: Number,
      default: 0,
    },
    checked_by_system: {
      type: Boolean,
      default: false,
    },
    checked_by_teacher: {
      type: Boolean,
      default: false,
    },
    review_status: {
      type: String,
      enum: REVIEW_STATUS,
      default: "auto_checked",
      index: true,
    },
    review_comment: {
      type: String,
      default: null,
    },
    reviewed_at: {
      type: Date,
      default: null,
    },
    answered_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  },
);

attemptAnswerSchema.index({ attempt_id: 1, question_id: 1 }, { unique: true });
attemptAnswerSchema.index({ test_id: 1, student_id: 1, question_id: 1 });

const AttemptAnswer = mongoose.model("AttemptAnswer", attemptAnswerSchema);

module.exports = AttemptAnswer;
