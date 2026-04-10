/* ==========  backend/src/services/resultService.js  ===============*/
const {
  Test,
  TestSlot,
  TestAttempt,
  TestResult,
  TestCandidate,
  Question,
  QuestionOption,
  AttemptAnswer,
} = require("../models");
const ApiError = require("../utils/apiError");

/* ==========  Function getGrade gets get grade data for the current module flow.  ===============*/
function getGrade(percentage) {
  if (percentage >= 80) {
    return "A+";
  }

  if (percentage >= 70) {
    return "A";
  }

  if (percentage >= 60) {
    return "A-";
  }

  if (percentage >= 50) {
    return "B";
  }

  if (percentage >= 40) {
    return "C";
  }

  return "F";
}

/* ==========  Function normalizeObjectIdArray builds helper output used by other functions in this file.  ===============*/
function normalizeObjectIdArray(values = []) {
  return values.map((item) => String(item)).sort();
}

/* ==========  Function arraysMatchAsSet contains reusable module logic used by this feature.  ===============*/
function arraysMatchAsSet(valuesA = [], valuesB = []) {
  if (valuesA.length !== valuesB.length) {
    return false;
  }

  const sortedA = normalizeObjectIdArray(valuesA);
  const sortedB = normalizeObjectIdArray(valuesB);

  return sortedA.every((value, index) => value === sortedB[index]);
}

/* ==========  Function normalizeText builds helper output used by other functions in this file.  ===============*/
function normalizeText(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/* ==========  Function getAttemptWithContext gets get attempt with context data for the current module flow.  ===============*/
async function getAttemptWithContext(attemptId) {
  const attempt = await TestAttempt.findById(attemptId);
  if (!attempt) {
    throw new ApiError(404, "Attempt not found");
  }

  const [test, slot] = await Promise.all([
    Test.findById(attempt.test_id).lean(),
    TestSlot.findById(attempt.slot_id).lean(),
  ]);

  if (!test || !slot) {
    throw new ApiError(400, "Attempt context is invalid");
  }

  return {
    attempt,
    test,
    slot,
  };
}

/* ==========  Function computeAttemptDeadline builds helper output used by other functions in this file.  ===============*/
function computeAttemptDeadline(attempt, test, slot) {
  const now = new Date();
  const absoluteEnd = Math.min(
    new Date(test.end_time).getTime(),
    new Date(slot.end_time).getTime(),
  );

  const durationLimitMinutes = Math.min(
    Number(test.duration_minutes || 0) || Number.MAX_SAFE_INTEGER,
    Number(slot.duration_minutes || 0) || Number.MAX_SAFE_INTEGER,
  );

  const durationEnd =
    durationLimitMinutes === Number.MAX_SAFE_INTEGER
      ? Number.MAX_SAFE_INTEGER
      : new Date(attempt.started_at).getTime() +
        durationLimitMinutes * 60 * 1000;

  const deadlineMs = Math.min(absoluteEnd, durationEnd);

  return {
    now,
    deadline: new Date(deadlineMs),
    isTimedOut: now.getTime() > deadlineMs,
  };
}

/* ==========  Function calculateAttemptSnapshot builds helper output used by other functions in this file.  ===============*/
async function calculateAttemptSnapshot(attemptInput) {
  const attempt = attemptInput.toObject
    ? attemptInput.toObject()
    : attemptInput;

  const [test, questions, answers] = await Promise.all([
    Test.findById(attempt.test_id).lean(),
    Question.find({
      test_id: attempt.test_id,
      question_set_id: attempt.question_set_id,
      status: { $ne: "deleted" },
    })
      .sort({ question_no: 1, _id: 1 })
      .lean(),
    AttemptAnswer.find({ attempt_id: attempt._id }).lean(),
  ]);

  if (!test) {
    throw new ApiError(400, "Test not found while calculating result");
  }

  const questionMap = new Map(
    questions.map((question) => [String(question._id), question]),
  );
  const answersMap = new Map(
    answers.map((answer) => [String(answer.question_id), answer]),
  );

  let answered = 0;
  let skipped = 0;
  let correct = 0;
  let wrong = 0;
  let textAnswered = 0;
  let mcqMarks = 0;
  let negativeMarks = 0;
  let manualAddedMarks = 0;
  let textAutoMarks = 0;
  let textPendingReviewCount = 0;
  let totalMarks = 0;

  for (const question of questions) {
    totalMarks += Number(question.score || 0);

    const answer = answersMap.get(String(question._id));

    if (!answer || answer.is_skipped) {
      skipped += 1;
      continue;
    }

    answered += 1;

    if (answer.is_correct === true) {
      correct += 1;
    }

    if (answer.is_correct === false) {
      wrong += 1;
    }

    if (question.question_type === "text") {
      textAnswered += 1;

      if (answer.review_status === "pending_manual_review") {
        textPendingReviewCount += 1;
      }

      if (answer.checked_by_teacher) {
        manualAddedMarks += Number(answer.obtained_marks || 0);
      } else if (answer.checked_by_system) {
        textAutoMarks += Number(answer.obtained_marks || 0);
      }
    } else {
      mcqMarks += Number(answer.obtained_marks || 0);
      negativeMarks += Number(answer.negative_marks_applied || 0);
    }
  }

  const finalMarks =
    mcqMarks + manualAddedMarks + textAutoMarks - negativeMarks;
  const boundedFinalMarks = Number.isFinite(finalMarks) ? finalMarks : 0;
  const percentage =
    totalMarks > 0 ? (boundedFinalMarks / totalMarks) * 100 : 0;

  return {
    refs: {
      test_id: attempt.test_id,
      attempt_id: attempt._id,
      student_id: attempt.student_id,
      slot_id: attempt.slot_id,
      question_set_id: attempt.question_set_id,
    },
    totals: {
      total_questions: questions.length,
      total_marks: totalMarks,
      answered,
      skipped,
      correct,
      wrong,
      text_answered: textAnswered,
      mcq_marks: mcqMarks,
      negative_marks: negativeMarks,
      manual_added_marks: manualAddedMarks,
      final_marks: boundedFinalMarks,
      percentage,
      grade: getGrade(percentage),
      answered_count: answered,
      skipped_count: skipped,
      correct_count: correct,
      wrong_count: wrong,
      obtained_marks: boundedFinalMarks,
      text_pending_review_count: textPendingReviewCount,
    },
    test,
    questions,
    answers,
  };
}

/* ==========  Function upsertAttemptResult contains reusable module logic used by this feature.  ===============*/
async function upsertAttemptResult(attemptDoc, options = {}) {
  const attempt = attemptDoc.toObject
    ? attemptDoc
    : await TestAttempt.findById(attemptDoc._id || attemptDoc);
  if (!attempt) {
    throw new ApiError(404, "Attempt not found");
  }

  const snapshot = await calculateAttemptSnapshot(attempt);
  const submittedAt = options.submittedAt || attempt.submitted_at || new Date();
  const status = options.status || attempt.status || "submitted";

  const updateAttemptPayload = {
    total_questions: snapshot.totals.total_questions,
    answered_count: snapshot.totals.answered_count,
    skipped_count: snapshot.totals.skipped_count,
    total_marks: snapshot.totals.total_marks,
    obtained_marks: snapshot.totals.obtained_marks,
    correct_count: snapshot.totals.correct_count,
    wrong_count: snapshot.totals.wrong_count,
    text_pending_review_count: snapshot.totals.text_pending_review_count,
    time_spent_seconds: Math.max(
      0,
      Math.floor(
        (new Date(submittedAt).getTime() -
          new Date(attempt.started_at).getTime()) /
          1000,
      ),
    ),
  };

  if (status !== "in_progress") {
    updateAttemptPayload.status = status;
    updateAttemptPayload.submitted_at = submittedAt;
  }

  if (options.autoSubmitted !== undefined) {
    updateAttemptPayload.auto_submitted = Boolean(options.autoSubmitted);
  }

  const updatedAttempt = await TestAttempt.findByIdAndUpdate(
    attempt._id,
    updateAttemptPayload,
    {
      new: true,
      runValidators: true,
    },
  );

  const resultStatus = snapshot.test.show_result_to_student
    ? "published"
    : "draft";

  const resultPayload = {
    test_id: snapshot.refs.test_id,
    attempt_id: snapshot.refs.attempt_id,
    student_id: snapshot.refs.student_id,
    slot_id: snapshot.refs.slot_id,
    question_set_id: snapshot.refs.question_set_id,
    total_questions: snapshot.totals.total_questions,
    answered: snapshot.totals.answered,
    skipped: snapshot.totals.skipped,
    correct: snapshot.totals.correct,
    wrong: snapshot.totals.wrong,
    text_answered: snapshot.totals.text_answered,
    mcq_marks: snapshot.totals.mcq_marks,
    negative_marks: snapshot.totals.negative_marks,
    manual_added_marks: snapshot.totals.manual_added_marks,
    final_marks: snapshot.totals.final_marks,
    percentage: snapshot.totals.percentage,
    grade: snapshot.totals.grade,
    result_status: resultStatus,
    published_at: resultStatus === "published" ? submittedAt : null,
  };

  const result = await TestResult.findOneAndUpdate(
    { attempt_id: snapshot.refs.attempt_id },
    resultPayload,
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    },
  );

  if (status === "submitted" || status === "timeout") {
    await TestCandidate.findOneAndUpdate(
      {
        test_id: snapshot.refs.test_id,
        student_id: snapshot.refs.student_id,
      },
      {
        attendance_status: status,
        submitted_at: submittedAt,
      },
      { new: false },
    );
  }

  return {
    attempt: updatedAttempt,
    result,
    snapshot,
  };
}

/* ==========  Function evaluateMcqAnswer contains reusable module logic used by this feature.  ===============*/
async function evaluateMcqAnswer({ question, answerPayload, test }) {
  const selectedOptionIds = normalizeObjectIdArray(
    answerPayload.selected_option_ids || [],
  );

  if (question.question_type === "radio" && selectedOptionIds.length !== 1) {
    throw new ApiError(
      400,
      "radio question requires exactly one selected option",
    );
  }

  if (question.question_type === "checkbox" && selectedOptionIds.length < 1) {
    throw new ApiError(
      400,
      "checkbox question requires at least one selected option",
    );
  }

  const options = await QuestionOption.find({
    question_id: question._id,
  })
    .select("_id is_correct")
    .lean();

  const allowedOptionIds = new Set(options.map((option) => String(option._id)));

  for (const optionId of selectedOptionIds) {
    if (!allowedOptionIds.has(optionId)) {
      throw new ApiError(400, "selected_option_ids contains invalid option id");
    }
  }

  const correctOptionIds = normalizeObjectIdArray(
    options.filter((option) => option.is_correct).map((option) => option._id),
  );

  const isCorrect = arraysMatchAsSet(selectedOptionIds, correctOptionIds);

  let negative = 0;
  if (!isCorrect && test.negative_marking_enabled) {
    negative = Number(
      question.negative_mark || test.negative_mark_per_wrong || 0,
    );
  }

  return {
    is_correct: isCorrect,
    obtained_marks: isCorrect ? Number(question.score || 0) : 0,
    negative_marks_applied: isCorrect ? 0 : negative,
    review_status: "auto_checked",
    checked_by_system: true,
    checked_by_teacher: false,
    selected_option_ids: selectedOptionIds,
    text_answer_html: null,
    text_answer_plain: null,
  };
}

/* ==========  Function evaluateTextAnswer contains reusable module logic used by this feature.  ===============*/
function evaluateTextAnswer({ question, answerPayload }) {
  const plainAnswer = answerPayload.text_answer_plain
    ? String(answerPayload.text_answer_plain)
    : null;

  const htmlAnswer = answerPayload.text_answer_html
    ? String(answerPayload.text_answer_html)
    : null;

  if (!plainAnswer && !htmlAnswer) {
    throw new ApiError(
      400,
      "text answer requires text_answer_plain or text_answer_html",
    );
  }

  const autoCheck = process.env.AUTO_CHECK_TEXT_ANSWER === "true";

  let isCorrect = null;
  let obtained = 0;
  let reviewStatus = "pending_manual_review";
  let checkedBySystem = false;

  if (autoCheck && question.correct_text_answer) {
    isCorrect =
      normalizeText(question.correct_text_answer) ===
      normalizeText(plainAnswer || htmlAnswer);
    obtained = isCorrect ? Number(question.score || 0) : 0;
    reviewStatus = "auto_checked";
    checkedBySystem = true;
  }

  return {
    is_correct: isCorrect,
    obtained_marks: obtained,
    negative_marks_applied: 0,
    review_status: reviewStatus,
    checked_by_system: checkedBySystem,
    checked_by_teacher: false,
    selected_option_ids: [],
    text_answer_html: htmlAnswer,
    text_answer_plain: plainAnswer,
  };
}

module.exports = {
  getGrade,
  getAttemptWithContext,
  computeAttemptDeadline,
  calculateAttemptSnapshot,
  upsertAttemptResult,
  evaluateMcqAnswer,
  evaluateTextAnswer,
};
