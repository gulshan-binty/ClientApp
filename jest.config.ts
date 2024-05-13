import type { Config } from "jest";
import nextJest from "next/jest.js";
import path from "path";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Resolve the absolute path to jest.setup.ts
const setupFilesAfterEnvPath = path.resolve(__dirname, "jest.setup.ts");

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  // Use the resolved path for setupFilesAfterEnv
  setupFilesAfterEnv: [setupFilesAfterEnvPath],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
