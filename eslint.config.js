import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['assets/js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        gsap: 'readonly',
        ScrollTrigger: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'eqeqeq': 'error',
      'no-console': 'off',
    },
  },
  {
    // main.js consumes the other modules which expose themselves on window
    files: ['assets/js/main.js'],
    languageOptions: {
      globals: {
        GitHub: 'readonly',
        Animations: 'readonly',
        DragonBalls: 'readonly',
      },
    },
  },
];
