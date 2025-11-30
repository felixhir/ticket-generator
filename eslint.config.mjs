import next from 'eslint-config-next'
import tseslint from 'typescript-eslint'

const eslintConfig = [
    {
        linterOptions: {
            reportUnusedDisableDirectives: 'off'
        },
        languageOptions: {
            parserOptions: {
                ecmaVersion: 'latest'
            }
        }
    },
    ...tseslint.configs.recommended,
    ...next,
    {
        rules: {
            'jsx-a11y/alt-text': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@next/next/no-img-element': 'off'
        }
    },
    {
        ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts']
    }
]
export default eslintConfig
