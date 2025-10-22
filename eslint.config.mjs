import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      "**/dist/**",
      "**/.env",
      "**/.env.*",
      "**/.vscode/**",
      "**/.idea/**",
      "**/.DS_Store",
      "**/Thumbs.db",
      "**/*.log",
      "**/npm-debug.log*",
      "**/yarn-debug.log*",
      "**/yarn-error.log*",
      "**/coverage/**",
      "**/.nyc_output/**",
      "**/*.swp",
      "**/*.swo",
      "**/*~",
      "**/.cache/**",
      // Test folders and files
      "cypress/**",
      "**/*.test.*",
      "**/*.spec.*",
      "**/__tests__/**",
      "**/*.cy.*",
      "**/test/**",
      "**/tests/**",
      // Scripts folder (Node.js scripts)
      "scripts/**",
      "**/scripts/**",
      // Temporary files
      "**/translate_locales_temp.js"
    ]
  },
  {
    rules: {
      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",

      // General code quality rules
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-var": "error",

      // React specific rules
      "react/no-unescaped-entities": "off",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default eslintConfig;
