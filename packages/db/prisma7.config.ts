import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

dotenv.config({
  path: "../../.env",
});

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "./migrations",
  },

  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
