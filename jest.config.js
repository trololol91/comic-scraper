module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/src/**/?(*.)+(spec|test).[jt]s?(x)'],
	coverageReporters: ['json', 'lcov', 'text', 'clover'],
	collectCoverageFrom: ['src/**/*.{ts,tsx}'],
	moduleNameMapper: {
		'^~src/(.*)$': '<rootDir>/src/$1'
	}
};
