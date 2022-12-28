const config = {
	preset: 'ts-jest',
	collectCoverageFrom: [
		'<rootDir>/src/**/*.ts',
		'!<rootDir>/src/**/protocol.ts',
		'!<rootDir>/src/main/**',
		'!<rootDir>/src/domain/**',
		'!<rootDir>/src/**/types.ts',
		'!<rootDir>/src/utils/types/**',
		'!**/protocols/**',
		'!**/protocols.ts',
		'!**/entities/**',
		'!**/test/**',
		'!**/tests/**',
	],
	coverageDirectory: 'coverage',
	coverageReporters: ['json-summary', 'json', 'lcov', 'text', 'clover'],
	coverageProvider: 'babel',
	testEnvironment: 'node',
	transform: {
		'.+\\.ts$': 'ts-jest',
	},
	testMatch: ['**/*.(spec|test).ts'],
	moduleNameMapper: {
		'~/(.*)': '<rootDir>/src/$1',
	},
	globals: {
		'ts-jest': {
			isolatedModules: true,
		},
	},
	clearMocks: true,
};

module.exports = config;
