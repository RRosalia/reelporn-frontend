# Code Coverage

## Current Status

Code coverage is **not currently enabled** for Cypress E2E tests in this project.

## Why?

Next.js 16 (beta) uses Turbopack by default for builds, which currently has limited support for code instrumentation tools like Babel plugins (specifically `babel-plugin-istanbul`). The traditional approach of using `@cypress/code-coverage` with Babel instrumentation conflicts with Turbopack's compilation process.

### Attempted Solutions

We tried:
1. ✗ **Babel instrumentation** - Causes build errors ("React is not defined") due to conflicts between Babel transforms and Turbopack
2. ✗ **Disabling Turbopack** - Not straightforward in Next.js 16 beta where Turbopack is the default

## Future Implementation Options

Once Next.js 16 reaches stable release or Turbopack improves its Babel plugin support, you can add code coverage using one of these approaches:

### Option 1: Babel Instrumentation (Traditional)

**When to use**: When Next.js/Turbopack fully supports Babel plugins or when using Webpack mode.

1. Install dependencies:
```bash
bun add -D @cypress/code-coverage @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript babel-plugin-istanbul nyc
```

2. Create `.babelrc.js`:
```javascript
module.exports = {
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
  plugins: [
    process.env.CYPRESS_COVERAGE && 'babel-plugin-istanbul',
  ].filter(Boolean),
};
```

3. Update `cypress.config.ts`:
```typescript
setupNodeEvents(on, config) {
  require('@cypress/code-coverage/task')(on, config);
  return config;
}
```

4. Update `cypress/support/e2e.ts`:
```typescript
import '@cypress/code-coverage/support';
```

### Option 2: V8/C8 Coverage (Modern)

**When to use**: For native Node.js/V8 coverage without build-time instrumentation.

1. Install c8:
```bash
bun add -D c8
```

2. Run Next.js with NODE_V8_COVERAGE:
```bash
NODE_V8_COVERAGE=./coverage next start
```

3. Use c8 to generate reports from coverage data

### Option 3: Next.js Instrumentation (Future)

Wait for official Next.js/Turbopack code coverage support, which may include native instrumentation APIs.

## Current Workaround

For now, ensure code quality through:
- ✅ **E2E tests** - Cypress tests verify functionality
- ✅ **Type checking** - TypeScript catches type errors (`bun run type-check`)
- ✅ **Linting** - ESLint catches code quality issues (`bun run lint`)
- ✅ **Manual testing** - Test critical paths manually

## References

- [Next.js Issue: Code Coverage with Turbopack](https://github.com/vercel/next.js/issues)
- [@cypress/code-coverage Documentation](https://github.com/cypress-io/code-coverage)
- [Node.js V8 Coverage](https://nodejs.org/api/cli.html#node_v8_coveragedir)
