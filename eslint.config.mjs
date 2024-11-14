import simpleImportSort from "eslint-plugin-simple-import-sort";
import tsParser from "@typescript-eslint/parser";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    ignores: ["node_modules/**/*", "**/node_modules/**/*"],
  },
  js.configs.recommended,
  // TODO strict
  ...tseslint.configs.recommendedTypeChecked,
  eslintConfigPrettier,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },

    languageOptions: {
      parser: tsParser,
      sourceType: "module",
      parserOptions: {
        project: ["tsconfig.eslint.json"],
      },
    },

    rules: {
      "block-scoped-var": "error",
      eqeqeq: "error",
      "no-var": "error",
      "prefer-arrow-callback": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "no-restricted-globals": ["error", "event", "length", "stop", "toString"],
      "no-restricted-properties": [
        "error",
        {
          object: "describe",
          property: "only",
        },
        {
          object: "it",

          property: "only",
        },
      ],
      "@typescript-eslint/method-signature-style": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "[iI]gnored",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^ignore",
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/strict-boolean-expressions": [
        "error",
        {
          allowString: true,
          allowNumber: false,
          allowNullableObject: true,
        },
      ],
    },
  },
];
