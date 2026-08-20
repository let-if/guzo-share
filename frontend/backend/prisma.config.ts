// import "dotenv/config";
// import { defineConfig, env } from "@prisma/config";

// export default defineConfig({
//   schema: "prisma/schema.prisma",
//   datasource: {
//     url: env("DATABASE_URL"),
//   },
// });
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: "postgresql://neondb_owner:npg_lXk8eag3NdDc@ep-mute-violet-ay4qeky0.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require",
  },
});