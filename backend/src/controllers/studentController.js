/* ==========  backend/src/controllers/studentController.js  ===============*/
const studentService = require("../services/studentService");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

/* ==========  Function getAssignedTests gets get assigned tests data for the current module flow.  ===============*/
const getAssignedTests = asyncHandler(async (req, res) => {
  const result = await studentService.listAssignedTests(req.query, req.user);
  sendSuccess(res, result.items, "Assigned tests fetched", 200, result.meta);
});

/* ==========  Function getPerformedExams gets get performed exams data for the current module flow.  ===============*/
const getPerformedExams = asyncHandler(async (req, res) => {
  const result = await studentService.listPerformedExams(req.query, req.user);
  sendSuccess(
    res,
    result.items,
    "Performed exams with attempts fetched",
    200,
    result.meta,
  );
});

/* ==========  Function getDashboardMetrics gets get dashboard metrics data for the current module flow.  ===============*/
const getDashboardMetrics = asyncHandler(async (req, res) => {
  const metrics = await studentService.getStudentDashboardMetrics(req.user);
  sendSuccess(res, metrics, "Dashboard metrics fetched");
});

/* ==========  Function getTestById gets get test by id data for the current module flow.  ===============*/
const getTestById = asyncHandler(async (req, res) => {
  const test = await studentService.getAssignedTestDetails(
    req.params.testId,
    req.user,
  );
  sendSuccess(res, test, "Assigned test details fetched");
});

/* ==========  Function startTest contains reusable module logic used by this feature.  ===============*/
const startTest = asyncHandler(async (req, res) => {
  const data = await studentService.startTest(
    req.params.testId,
    req.body,
    req.user,
  );
  sendSuccess(res, data, "Test started successfully", 201);
});

/* ==========  Function getCurrentQuestion gets get current question data for the current module flow.  ===============*/
const getCurrentQuestion = asyncHandler(async (req, res) => {
  const data = await studentService.getCurrentQuestion(
    req.params.attemptId,
    req.user,
  );
  sendSuccess(res, data, "Current question fetched");
});

/* ==========  Function saveAnswer updates save answer values for this workflow.  ===============*/
const saveAnswer = asyncHandler(async (req, res) => {
  const data = await studentService.answerCurrentQuestion(
    req.params.attemptId,
    req.body,
    req.user,
  );
  sendSuccess(res, data, "Answer saved successfully");
});

/* ==========  Function skipQuestion contains reusable module logic used by this feature.  ===============*/
const skipQuestion = asyncHandler(async (req, res) => {
  const data = await studentService.skipCurrentQuestion(
    req.params.attemptId,
    req.user,
  );
  sendSuccess(res, data, "Question skipped successfully");
});

/* ==========  Function submitAttempt contains reusable module logic used by this feature.  ===============*/
const submitAttempt = asyncHandler(async (req, res) => {
  const data = await studentService.submitAttempt(
    req.params.attemptId,
    req.user,
  );
  sendSuccess(res, data, "Attempt submitted successfully");
});

/* ==========  Function getAttemptResult gets get attempt result data for the current module flow.  ===============*/
const getAttemptResult = asyncHandler(async (req, res) => {
  const data = await studentService.getAttemptResult(
    req.params.attemptId,
    req.user,
  );
  sendSuccess(res, data, "Attempt result fetched");
});

module.exports = {
  getAssignedTests,
  getPerformedExams,
  getDashboardMetrics,
  getTestById,
  startTest,
  getCurrentQuestion,
  saveAnswer,
  skipQuestion,
  submitAttempt,
  getAttemptResult,
};
