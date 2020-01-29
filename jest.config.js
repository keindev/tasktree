module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    coverageReporters: ['text-summary', 'json'],
    testRegex: '(/__tests__/.*|(\\.|/)(test))\\.(tsx?)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testPathIgnorePatterns: ['/lib/', '/node_modules/'],
};
