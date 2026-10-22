import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

// docs/BUILD_PROMPT.md Section 5.7: banned AI cliché icons. `Star` is allowed only in the rating component.
const BANNED_ICONS = [
  "Sparkles",
  "Sparkle",
  "WandSparkles",
  "Wand",
  "Zap",
  "Rocket",
  "Bot",
  "BrainCircuit",
  "Brain",
  "Stars",
  "Flame",
  "Gem",
  "Crown",
  "Trophy",
  "PartyPopper",
  "Atom",
  "Orbit",
  "Infinity",
  "Magnet",
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      // Omitting a key by destructuring ({ _meta, ...rest }) is intended.
      "@typescript-eslint/no-unused-vars": ["warn", { ignoreRestSiblings: true, varsIgnorePattern: "^_" }],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "lucide-react",
              importNames: [...BANNED_ICONS, ...BANNED_ICONS.map((n) => `${n}Icon`)],
              message: "Dieses Icon steht auf der Sperrliste (BUILD_PROMPT 5.7).",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    ".content-collections/**",
  ]),
]);

export default eslintConfig;
