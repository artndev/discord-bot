import pluginJs from '@eslint/js';
import pluginPrettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default [
    {
        ignores: ['node_modules/**'],
    },
    {
        files: ['**/*.{js,mjs,cjs,jsx}'],
    },
    {
        languageOptions: { globals: globals.browser },
    },
    pluginJs.configs.recommended,
    pluginPrettier,
];
