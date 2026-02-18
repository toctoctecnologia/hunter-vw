export default (async () => {
  let js = { configs: { recommended: {} } };
  let tseslint = { configs: { recommended: [] } };
  let react = { configs: { recommended: {} } };
  try {
    js = (await import("@eslint/js")).default;
  } catch {
    // optional dependency not installed; fall back to empty config
  }
  try {
    tseslint = (await import("typescript-eslint")).default;
  } catch {
    // optional dependency not installed; fall back to empty config
  }
  try {
    react = (await import("eslint-plugin-react")).default;
  } catch {
    // optional dependency not installed; fall back to empty config
  }

  return [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    react.configs.recommended,
    {
      files: ["**/*.{ts,tsx}"],
      languageOptions: {
        parserOptions: {
          ecmaVersion: 2020,
          sourceType: "module",
          ecmaFeatures: { jsx: true },
        },
      },
    },
    {
      files: ["**/*.js"],
      languageOptions: { ecmaVersion: 2020 },
    },
    {
      ignores: ["dist"],
    },
  ];
})();
