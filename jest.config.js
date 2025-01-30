module.exports = {
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'test-results',
      outputName: 'jest.xml'
    }]
  ],
    transform: {
      "^.+\\.[t|j]sx?$": "babel-jest", // Use babel-jest to transform JavaScript and JSX files
    },
    transformIgnorePatterns: [
      "/node_modules/(?!axios)/", // Ensure axios is transformed by Babel, even though it's inside node_modules
    ],
  };
  