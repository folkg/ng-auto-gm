import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "node_modules/**/*",
      "**/node_modules/**/*",
      "eslint.config.mjs",
      ".angular/**/*",
      "dist/**/*",
    ],
  },
  js.configs.recommended,
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
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: false,
          allowTernary: false,
          allowTaggedTemplates: false,
        },
      ],
      "@typescript-eslint/unbound-method": [
        "error",
        {
          ignoreStatic: true,
        },
      ],
    },
  },
];
