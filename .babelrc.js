module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    // Only instrument code for coverage when running Cypress tests
    process.env.CYPRESS_COVERAGE && 'babel-plugin-istanbul',
  ].filter(Boolean),
};
