/* ==========  backend/src/scripts/seedUsers.js  ===============*/
const dotenv = require("dotenv");

dotenv.config();
dotenv.config({ path: ".env.local" });

const { connectToDatabase, closeDatabase } = require("../config/db");
const { User } = require("../models");

/* ==========  Function ensureUser validates input and access before the next logic runs.  ===============*/
async function ensureUser(payload) {
  const existing = await User.findOne({
    $or: [{ email: payload.email }, { user_id_login: payload.user_id_login }],
  }).lean();

  if (existing) {
    console.log(
      `User already exists: ${payload.email || payload.user_id_login}`,
    );
    return existing;
  }

  const created = await User.create(payload);
  console.log(`Created user: ${created.email || created.user_id_login}`);
  return created;
}

/* ==========  Function run contains reusable module logic used by this feature.  ===============*/
async function run() {
  await connectToDatabase();

  await ensureUser({
    ref_id: "T-001",
    full_name: "Demo Teacher",
    email: "teacher@example.com",
    user_id_login: "teacher1",
    password_hash: "Teacher@123",
    role: "teacher",
    status: "active",
  });

  await ensureUser({
    ref_id: "S-001",
    full_name: "Demo Student",
    email: "student@example.com",
    user_id_login: "student1",
    password_hash: "Student@123",
    role: "student",
    status: "active",
  });

  await closeDatabase();
}

run()
  .then(() => {
    console.log("Seed completed");
    process.exit(0);
  })
  .catch(async (error) => {
    console.error("Seed failed:", error.message);
    await closeDatabase();
    process.exit(1);
  });
