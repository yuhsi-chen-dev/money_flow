import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier'

const config = [
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
  prettier,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/ban-ts-comment': 'error',
      // New in react-hooks plugin shipped with eslint-config-next 16; flags
      // our intentional data-hydration patterns (setState from useEffect
      // after a one-shot fetch). The pattern is correct for our scale.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]

export default config
