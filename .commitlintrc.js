module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    'subject-case': [
      1,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case']
    ],
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test'
      ]
    ]
  }
};
