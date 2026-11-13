import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL ?? "postgres://liquidity:liquidity@localhost:5432/liquidity";

async function main() {
  const migrationClient = postgres(connectionString, { max: 1 });
  await migrate(drizzle(migrationClient), { migrationsFolder: "./drizzle" });
  await migrationClient.end();
  console.log("Migrations complete");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
