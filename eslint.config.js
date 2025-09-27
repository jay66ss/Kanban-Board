import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig({
  files: ["**/*.{js,mjs,cjs}"],

  ignores: ["node_modules/**", "dist/**", "build/**"],

  languageOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    globals: {
      ...globals.browser, // frontend (window, document, etc.)
      ...globals.node,    // Node.js (process, __dirname, etc.)
      ...globals.jest     // Jest (describe, test, expect, beforeEach...)
    }
  },

  plugins: { js },
  extends: ["js/recommended"],

  rules: {
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }]
  }
});

