#!/usr/bin/env node

/**
 * Translation Validation Script
 *
 * Validates all locale JSON files and checks for:
 * - Valid JSON syntax
 * - Missing keys compared to en.json
 * - Extra keys not in en.json
 *
 * Usage: node scripts/validate-translations.js
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'src', 'i18n', 'locales');
const SOURCE_LOCALE = 'en';

/**
 * Get all keys from a nested object as flat paths
 */
function getFlatKeys(obj, prefix = '') {
  let keys = [];

  for (const [key, value] of Object.entries(obj)) {
    const newPrefix = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys = keys.concat(getFlatKeys(value, newPrefix));
    } else {
      keys.push(newPrefix);
    }
  }

  return keys;
}

/**
 * Validate a single locale file
 */
function validateLocale(locale, sourceKeys) {
  const filePath = path.join(LOCALES_DIR, `${locale}.json`);

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`Validating: ${locale}.json`);
  console.log('─'.repeat(60));

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.error(`✗ File not found: ${filePath}`);
    return false;
  }

  try {
    // Parse JSON
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    const keys = getFlatKeys(data);
    const keySet = new Set(keys);

    console.log(`Total keys: ${keys.length}`);

    // Find missing keys
    const missingKeys = sourceKeys.filter(key => !keySet.has(key));
    if (missingKeys.length > 0) {
      console.log(`\n⚠ Missing ${missingKeys.length} keys:`);
      missingKeys.slice(0, 10).forEach(key => console.log(`  - ${key}`));
      if (missingKeys.length > 10) {
        console.log(`  ... and ${missingKeys.length - 10} more`);
      }
    }

    // Find extra keys
    const extraKeys = keys.filter(key => !sourceKeys.includes(key));
    if (extraKeys.length > 0) {
      console.log(`\n⚠ Extra ${extraKeys.length} keys (not in en.json):`);
      extraKeys.slice(0, 10).forEach(key => console.log(`  - ${key}`));
      if (extraKeys.length > 10) {
        console.log(`  ... and ${extraKeys.length - 10} more`);
      }
    }

    // Summary
    if (missingKeys.length === 0 && extraKeys.length === 0) {
      console.log('\n✓ Perfect! All keys match en.json');
      return true;
    } else {
      console.log(`\n⚠ Validation complete with warnings`);
      return false;
    }

  } catch (error) {
    console.error(`✗ Error: ${error.message}`);
    return false;
  }
}

/**
 * Main execution
 */
function main() {
  console.log('='.repeat(60));
  console.log('Translation Validation');
  console.log('='.repeat(60));

  // Read source locale
  const sourceFile = path.join(LOCALES_DIR, `${SOURCE_LOCALE}.json`);
  if (!fs.existsSync(sourceFile)) {
    console.error(`\n✗ Source file not found: ${sourceFile}`);
    process.exit(1);
  }

  const sourceData = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
  const sourceKeys = getFlatKeys(sourceData);

  console.log(`\nSource: ${SOURCE_LOCALE}.json (${sourceKeys.length} keys)`);

  // Get all locale files
  const localeFiles = fs.readdirSync(LOCALES_DIR)
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''))
    .filter(locale => locale !== SOURCE_LOCALE)
    .sort();

  console.log(`Target locales: ${localeFiles.join(', ')}\n`);

  // Validate each locale
  let allValid = true;
  const results = {};

  for (const locale of localeFiles) {
    const isValid = validateLocale(locale, sourceKeys);
    results[locale] = isValid;
    if (!isValid) {
      allValid = false;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Validation Summary');
  console.log('='.repeat(60));

  for (const [locale, isValid] of Object.entries(results)) {
    const status = isValid ? '✓' : '⚠';
    console.log(`${status} ${locale}.json: ${isValid ? 'OK' : 'Has warnings'}`);
  }

  console.log('\n' + (allValid ? '✓ All validations passed!' : '⚠ Some locales have warnings'));
  console.log('Run "npm run translate:sync" to sync missing translations\n');

  process.exit(allValid ? 0 : 1);
}

// Run
main();
