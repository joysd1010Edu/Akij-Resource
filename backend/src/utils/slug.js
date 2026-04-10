/* ==========  backend/src/utils/slug.js  ===============*/
const slugify = require("slugify");

/* ==========  Function toSlug contains reusable module logic used by this feature.  ===============*/
function toSlug(value) {
  return slugify(String(value || ""), {
    lower: true,
    strict: true,
    trim: true,
  });
}

module.exports = {
  toSlug,
};
