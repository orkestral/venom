/* eslint-disable no-undef */
/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  ci: true,
  branches: [
    { name: 'release', prerelease: false },
    { name: 'staging', prerelease: true },
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        releaseRules: [
          { breaking: true, release: 'major' },
          { type: 'feat', release: 'minor' },
          { type: 'chore', release: 'patch' },
          { type: 'ci', release: 'patch' },
          { type: 'docs', release: 'patch' },
          { type: 'fix', release: 'patch' },
          { type: 'perf', release: 'patch' },
          { type: 'refactor', release: 'patch' },
          { type: 'style', release: 'patch' },
          { type: 'test', release: 'patch' },
          { type: 'build', release: 'patch' },
          { type: 'revert', release: 'patch' },
        ],
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'],
        },
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        presetConfig: {
          types: [
            { type: 'feat', section: 'Features', hidden: false },
            { type: 'fix', section: 'Bug Fixes', hidden: false },
            { type: 'chore', section: 'Internal Changes', hidden: false },
            { type: 'ci', section: 'Internal Changes', hidden: false },
            { type: 'perf', section: 'Internal Changes', hidden: false },
            { type: 'refactor', section: 'Internal Changes', hidden: false },
            { type: 'style', section: 'Internal Changes', hidden: false },
            { type: 'build', section: 'Internal Changes', hidden: false },
            { type: 'docs', section: 'Documentation', hidden: false },
            { type: 'revert', section: 'Reverts', hidden: false },
            { type: 'breaking', section: 'Breaking Changes', hidden: false },
            { type: 'test', hidden: true },
          ],
        },
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'],
        },
      },
    ],
    ['@semantic-release/npm'],
    [
      ' ',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md'],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
}
