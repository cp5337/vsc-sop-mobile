module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    // Code quality rules
    'no-unused-vars': 'error',
    'no-console': 'off',
    'no-debugger': 'error',
    
    // React specific rules - disabled to reduce console noise
    'react/prop-types': 'off',
    'react/no-unused-state': 'warn',
    'react/jsx-key': 'error',
    
    // Code style rules - disabled to reduce console noise
    'max-lines': 'off',
    'max-lines-per-function': 'off',
    'max-params': ['error', 5],
    'complexity': 'off',
    
    // Import rules - disabled to prevent blocking compilation
    'import/order': 'off'
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
