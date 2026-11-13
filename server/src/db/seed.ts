import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "./client.js";
import { users } from "./schema.js";

async function main() {
  const hashedPassword = await bcrypt.hash("admin", 10);

  await db
    .insert(users)
    .values({ email: "test@gmail.com", hashedPassword })
    .onConflictDoNothing({ target: users.email });

  console.log("Seeded admin user");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
