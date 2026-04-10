/* ==========  backend/src/utils/pagination.js  ===============*/
/* ==========  Function toPositiveNumber contains reusable module logic used by this feature.  ===============*/
function toPositiveNumber(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.floor(parsed);
}

/* ==========  Function parsePagination builds helper output used by other functions in this file.  ===============*/
function parsePagination(query = {}, defaults = {}) {
  const page = toPositiveNumber(query.page, defaults.page || 1);
  const limit = Math.min(
    toPositiveNumber(query.limit, defaults.limit || 10),
    100,
  );
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
}

/* ==========  Function buildPaginationMeta builds helper output used by other functions in this file.  ===============*/
function buildPaginationMeta({ total, page, limit }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    total,
    page,
    limit,
    total_pages: totalPages,
    has_next: page < totalPages,
    has_prev: page > 1,
  };
}

module.exports = {
  parsePagination,
  buildPaginationMeta,
};
