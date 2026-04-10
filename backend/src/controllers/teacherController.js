/* ==========  backend/src/controllers/teacherController.js  ===============*/
const teacherService = require("../services/teacherService");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

/* ==========  Function createTest creates create test data used by this module.  ===============*/
const createTest = asyncHandler(async (req, res) => {
  const test = await teacherService.createTest(req.body, req.user);
  sendSuccess(res, test, "Test created successfully", 201);
});

/* ==========  Function getTests gets get tests data for the current module flow.  ===============*/
const getTests = asyncHandler(async (req, res) => {
  const result = await teacherService.listTests(req.query, req.user);
  sendSuccess(res, result.items, "Test list fetched", 200, result.meta);
});

/* ==========  Function getDashboardMetrics gets get dashboard metrics data for the current module flow.  ===============*/
const getDashboardMetrics = asyncHandler(async (req, res) => {
  const metrics = await teacherService.getTeacherDashboardMetrics(req.user);
  sendSuccess(res, metrics, "Teacher dashboard metrics fetched");
});

/* ==========  Function getTestById gets get test by id data for the current module flow.  ===============*/
const getTestById = asyncHandler(async (req, res) => {
  const test = await teacherService.getTestDetails(req.params.testId, req.user);
  sendSuccess(res, test, "Test details fetched");
});

/* ==========  Function updateTest updates update test values for this workflow.  ===============*/
const updateTest = asyncHandler(async (req, res) => {
  const test = await teacherService.updateTest(
    req.params.testId,
    req.body,
    req.user,
  );
  sendSuccess(res, test, "Test updated successfully");
});

/* ==========  Function createSlot creates create slot data used by this module.  ===============*/
const createSlot = asyncHandler(async (req, res) => {
  const slot = await teacherService.createTestSlot(
    req.params.testId,
    req.body,
    req.user,
  );
  sendSuccess(res, slot, "Slot created successfully", 201);
});

/* ==========  Function createQuestionSet creates create question set data used by this module.  ===============*/
const createQuestionSet = asyncHandler(async (req, res) => {
  const set = await teacherService.createQuestionSet(
    req.params.testId,
    req.body,
    req.user,
  );
  sendSuccess(res, set, "Question set created successfully", 201);
});

/* ==========  Function createQuestion creates create question data used by this module.  ===============*/
const createQuestion = asyncHandler(async (req, res) => {
  const question = await teacherService.createQuestion(
    req.params.testId,
    req.body,
    req.user,
  );
  sendSuccess(res, question, "Question created successfully", 201);
});

/* ==========  Function updateQuestion updates update question values for this workflow.  ===============*/
const updateQuestion = asyncHandler(async (req, res) => {
  const question = await teacherService.updateQuestion(
    req.params.questionId,
    req.body,
    req.user,
  );

  sendSuccess(res, question, "Question updated successfully");
});

/* ==========  Function deleteQuestion removes delete question related data in this module.  ===============*/
const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await teacherService.removeQuestion(
    req.params.questionId,
    req.user,
  );
  sendSuccess(res, question, "Question removed successfully");
});

/* ==========  Function getTestQuestions gets get test questions data for the current module flow.  ===============*/
const getTestQuestions = asyncHandler(async (req, res) => {
  const result = await teacherService.listQuestions(
    req.params.testId,
    req.query,
    req.user,
  );
  sendSuccess(res, result.items, "Question list fetched", 200, result.meta);
});

/* ==========  Function addQuestionOptions creates add question options data used by this module.  ===============*/
const addQuestionOptions = asyncHandler(async (req, res) => {
  const result = await teacherService.addQuestionOptions(
    req.params.questionId,
    req.body,
    req.user,
  );

  sendSuccess(res, result, "Question options added", 201);
});

/* ==========  Function updateQuestionOption updates update question option values for this workflow.  ===============*/
const updateQuestionOption = asyncHandler(async (req, res) => {
  const result = await teacherService.updateQuestionOption(
    req.params.questionId,
    req.params.optionId,
    req.body,
    req.user,
  );

  sendSuccess(res, result, "Question option updated");
});

/* ==========  Function assignCandidates contains reusable module logic used by this feature.  ===============*/
const assignCandidates = asyncHandler(async (req, res) => {
  const result = await teacherService.assignCandidates(
    req.params.testId,
    req.body,
    req.user,
  );

  sendSuccess(res, result, "Candidates assigned successfully");
});

/* ==========  Function getCandidates gets get candidates data for the current module flow.  ===============*/
const getCandidates = asyncHandler(async (req, res) => {
  const result = await teacherService.listCandidates(
    req.params.testId,
    req.query,
    req.user,
  );
  sendSuccess(res, result.items, "Candidate list fetched", 200, result.meta);
});

/* ==========  Function publishTest contains reusable module logic used by this feature.  ===============*/
const publishTest = asyncHandler(async (req, res) => {
  const test = await teacherService.publishTest(req.params.testId, req.user);
  sendSuccess(res, test, "Test published successfully");
});

/* ==========  Function getMetrics gets get metrics data for the current module flow.  ===============*/
const getMetrics = asyncHandler(async (req, res) => {
  const metrics = await teacherService.getTestMetrics(
    req.params.testId,
    req.user,
  );
  sendSuccess(res, metrics, "Test metrics fetched");
});

/* ==========  Function getTextAnswerReviews gets get text answer reviews data for the current module flow.  ===============*/
const getTextAnswerReviews = asyncHandler(async (req, res) => {
  const result = await teacherService.getTextAnswerReviews(
    req.params.testId,
    req.query,
    req.user,
  );

  sendSuccess(
    res,
    result.items,
    "Text answer reviews fetched",
    200,
    result.meta,
  );
});

/* ==========  Function reviewTextAnswer contains reusable module logic used by this feature.  ===============*/
const reviewTextAnswer = asyncHandler(async (req, res) => {
  const result = await teacherService.reviewTextAnswer(
    req.params.answerId,
    req.body,
    req.user,
  );

  sendSuccess(res, result, "Text answer reviewed successfully");
});

module.exports = {
  createTest,
  getTests,
  getDashboardMetrics,
  getTestById,
  updateTest,
  createSlot,
  createQuestionSet,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getTestQuestions,
  addQuestionOptions,
  updateQuestionOption,
  assignCandidates,
  getCandidates,
  publishTest,
  getMetrics,
  getTextAnswerReviews,
  reviewTextAnswer,
};
