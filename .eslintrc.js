module.exports = {
    'extends': [
      '@beepbeepgo/eslint-config-beepbeepgo-common'
    ],
    rules: {
      'complexity': ['error', 50],
      'max-statements': ['error', 40],
      'react/jsx-uses-vars': 1,
      'handle-callback-err': 0,
      'callback-return': 0
    }
};
