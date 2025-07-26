import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "sqlite",
    schema: "./server/db/schema",
    out: "./src-tauri/migrations",
    verbose: false,
    strict: true,
    dbCredentials: {
        url: process.env.DEV_USE_LOCAL_SQLITE_DB_PATH
    }
});