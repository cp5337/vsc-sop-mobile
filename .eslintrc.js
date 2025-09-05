module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    // Code quality rules
    'no-unused-vars': 'error',
    'no-console': 'warn',
    'no-debugger': 'error',
    
    // React specific rules
    'react/prop-types': 'warn',
    'react/no-unused-state': 'warn',
    'react/jsx-key': 'error',
    
    // Code style rules
    'max-lines': ['error', 300],
    'max-lines-per-function': ['error', 100],
    'max-params': ['error', 5],
    'complexity': ['warn', 10],
    
    // Import rules
    'import/order': ['error', {
      'groups': [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index'
      ],
      'newlines-between': 'always'
    }]
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js'],
      rules: {
        'max-lines': 'off',
        'max-lines-per-function': 'off'
      }
    }
  ]
};
