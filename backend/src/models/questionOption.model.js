const mongoose = require("mongoose");

const questionOptionSchema = new mongoose.Schema(
  {
    question_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: [true, "question_id is required"],
      index: true,
    },
    option_key: {
      type: String,
      required: [true, "option_key is required"],
      trim: true,
      uppercase: true,
      maxlength: 20,
    },
    option_text_html: {
      type: String,
      required: [true, "option_text_html is required"],
      trim: true,
    },
    plain_text: {
      type: String,
      default: "",
    },
    is_correct: {
      type: Boolean,
      default: false,
    },
    sort_order: {
      type: Number,
      required: [true, "sort_order is required"],
      min: 1,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  },
);

questionOptionSchema.index({ question_id: 1, option_key: 1 }, { unique: true });
questionOptionSchema.index({ question_id: 1, sort_order: 1 }, { unique: true });

const QuestionOption = mongoose.model("QuestionOption", questionOptionSchema);

module.exports = QuestionOption;
