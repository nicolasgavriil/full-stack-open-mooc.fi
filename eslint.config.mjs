import js from "@eslint/js";
import globals from "globals";
//import pluginReact from "eslint-plugin-react";
import stylisticJs from "@stylistic/eslint-plugin";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // 1. Apply recommended JS rules
  js.configs.recommended,

  // 2. Spread the React recommended config array
  //...pluginReact.configs.flat.recommended,

  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, // Optional: add if you have node files
      },
    },
    // Combine all plugins into one object
    plugins: {
      "@stylistic/js": stylisticJs,
    },
    rules: {
      "@stylistic/js/indent": ["error", 2],
      "@stylistic/js/linebreak-style": ["error", "unix"],
      "@stylistic/js/quotes": ["error", "double", { avoidEscape: true }],
      "@stylistic/js/semi": ["error", "always"],
      eqeqeq: "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "arrow-spacing": ["error", { before: true, after: true }],
      "no-unused-vars": "off",
      "no-undef": "error",
    },
  },

  // 3. Global ignores must be in their own object without other keys
  {
    ignores: ["dist/**"],
  },
]);
