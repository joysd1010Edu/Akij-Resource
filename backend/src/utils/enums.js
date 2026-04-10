const USER_ROLES = ["teacher", "student", "admin"];
const USER_STATUS = ["active", "inactive", "suspended"];

const QUESTION_TYPES = ["radio", "checkbox", "text"];
const QUESTION_TYPE_MODES = ["radio", "checkbox", "text", "mixed"];

const TEST_STATUS = ["draft", "published", "running", "completed", "archived"];
const ACTIVE_STATUS = ["active", "inactive"];
const QUESTION_STATUS = ["active", "inactive", "deleted"];

const ATTENDANCE_STATUS = [
  "not_started",
  "in_progress",
  "submitted",
  "timeout",
  "absent",
];

const ATTEMPT_STATUS = ["in_progress", "submitted", "timeout", "evaluated"];
const REVIEW_STATUS = ["auto_checked", "pending_manual_review", "reviewed"];
const RESULT_STATUS = ["draft", "published"];

module.exports = {
  USER_ROLES,
  USER_STATUS,
  QUESTION_TYPES,
  QUESTION_TYPE_MODES,
  TEST_STATUS,
  ACTIVE_STATUS,
  QUESTION_STATUS,
  ATTENDANCE_STATUS,
  ATTEMPT_STATUS,
  REVIEW_STATUS,
  RESULT_STATUS,
};
