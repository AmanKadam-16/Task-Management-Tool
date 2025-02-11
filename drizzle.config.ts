import { defineConfig } from "drizzle-kit";


export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_z9ILyxeg0sJY@ep-proud-river-a88ensbs-pooler.eastus2.azure.neon.tech/neondb?sslmode=require',
  },
});
