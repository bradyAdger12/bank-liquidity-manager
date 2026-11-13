import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

const connectionString = process.env.DATABASE_URL ?? "postgres://liquidity:liquidity@localhost:5432/liquidity";

const queryClient = postgres(connectionString);

export const db = drizzle(queryClient, { schema });
