import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["app/**/*.test.ts", "extensions/**/*.test.{js,ts}"],
    environment: "node",
  },
});
