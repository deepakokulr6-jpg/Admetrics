module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      // Design tokens and copy live in one place each:
      //   colours  → src/theme/colors.ts      (colors.text)
      //   fonts    → src/theme/typography.ts  (fonts.semibold)
      //   UI text  → src/constants/strings.ts (strings.auth.logIn)
      files: ['src/**/*.{ts,tsx}'],
      excludedFiles: ['src/theme/**', 'src/utils/applyAppFont.ts'],
      rules: {
        'react/jsx-no-literals': ['error', { noStrings: false }],
        'no-restricted-syntax': [
          'error',
          {
            selector: 'Literal[value=/^#[0-9A-Fa-f]{3,8}$/]',
            message: 'Use a colour from src/theme/colors (e.g. colors.text).',
          },
          {
            selector: 'Literal[value=/^rgba?\\(/]',
            message: 'Use a colour from src/theme/colors.',
          },
          {
            selector: "Property[key.name='fontWeight']",
            message:
              'Pick the weight with fontFamily: fonts.medium (src/theme/typography), not fontWeight.',
          },
          {
            selector: 'Literal[value=/^Inter(-|$)/]',
            message: 'Use fonts.* from src/theme/typography.',
          },
        ],
      },
    },
  ],
};
