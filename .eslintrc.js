module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: [
		'standard',
	],
	parserOptions: {
		ecmaVersion: 13,
		sourceType: 'module',
	},
	rules: {
		'comma-dangle': ['error', 'always-multiline'],
		indent: ['error', 'tab'],
		'max-len': ['error', { code: 100, tabWidth: 2 }],
		'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
		quotes: ['error', 'single', { avoidEscape: true }],
		semi: ['error', 'never'],
		'no-tabs': ['error', { allowIndentationTabs: true }],
	},
}
