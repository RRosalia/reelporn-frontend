#!/usr/bin/env node

/**
 * Translation Sync Script using DeepL API
 *
 * This script compares en.json (source) with all other locale files
 * and translates missing keys using DeepL API.
 *
 * Usage: DEEPL_API_KEY=your_key node scripts/sync-translations.js
 */

const fs = require('fs');
const path = require('path');
const deepl = require('deepl-node');

// Configuration
const LOCALES_DIR = path.join(__dirname, '..', 'src', 'i18n', 'locales');
const SOURCE_LOCALE = 'en';

// Language mapping for DeepL API
const DEEPL_LANG_MAP = {
  'es': 'ES',      // Spanish
  'it': 'IT',      // Italian
  'pl': 'PL',      // Polish
  'pt': 'PT-PT',   // Portuguese (Portugal)
  'sv': 'SV',      // Swedish
  'cs': 'CS',      // Czech
  'de': 'DE',      // German
  'fr': 'FR',      // French
  'nl': 'NL',      // Dutch
};

// Initialize DeepL translator
const translator = new deepl.Translator(process.env.DEEPL_API_KEY);

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
 * Get value from nested object using dot notation path
 */
function getValueByPath(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Set value in nested object using dot notation path
 */
function setValueByPath(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (!(key in current)) {
      current[key] = {};
    }
    return current[key];
  }, obj);
  target[lastKey] = value;
}

/**
 * Find missing keys in target locale compared to source
 */
function findMissingKeys(sourceData, targetData) {
  const sourceKeys = getFlatKeys(sourceData);
  const targetKeys = new Set(getFlatKeys(targetData));

  return sourceKeys.filter(key => !targetKeys.has(key));
}

/**
 * Translate text using DeepL API
 */
async function translateText(text, targetLang) {
  try {
    // Skip if text is empty, contains only special characters, or is a format string
    if (!text || text.trim() === '' || /^[^a-zA-Z]+$/.test(text)) {
      return text;
    }

    const result = await translator.translateText(text, null, targetLang, {
      formality: 'default',
      preserveFormatting: true,
    });

    return result.text;
  } catch (error) {
    console.error(`Error translating "${text}" to ${targetLang}:`, error.message);
    return text; // Return original if translation fails
  }
}

/**
 * Translate missing keys for a locale
 */
async function syncLocale(locale) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Syncing locale: ${locale.toUpperCase()}`);
  console.log('='.repeat(60));

  const sourceFile = path.join(LOCALES_DIR, `${SOURCE_LOCALE}.json`);
  const targetFile = path.join(LOCALES_DIR, `${locale}.json`);

  // Read source and target files
  const sourceData = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
  let targetData = {};

  if (fs.existsSync(targetFile)) {
    targetData = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
  }

  // Find missing keys
  const missingKeys = findMissingKeys(sourceData, targetData);

  if (missingKeys.length === 0) {
    console.log(`✓ No missing keys. Locale is up to date.`);
    return;
  }

  console.log(`Found ${missingKeys.length} missing keys to translate...\n`);

  const deeplLang = DEEPL_LANG_MAP[locale];
  if (!deeplLang) {
    console.error(`✗ DeepL language code not found for locale: ${locale}`);
    return;
  }

  let translatedCount = 0;

  // Translate missing keys in batches
  const BATCH_SIZE = 10;
  for (let i = 0; i < missingKeys.length; i += BATCH_SIZE) {
    const batch = missingKeys.slice(i, i + BATCH_SIZE);

    console.log(`Translating batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(missingKeys.length / BATCH_SIZE)}...`);

    for (const key of batch) {
      const sourceValue = getValueByPath(sourceData, key);

      if (typeof sourceValue === 'string') {
        try {
          const translated = await translateText(sourceValue, deeplLang);
          setValueByPath(targetData, key, translated);
          translatedCount++;
          console.log(`  ✓ ${key}: "${sourceValue}" → "${translated}"`);
        } catch (error) {
          console.error(`  ✗ ${key}: Translation failed - ${error.message}`);
          setValueByPath(targetData, key, sourceValue); // Fallback to English
        }
      } else {
        // Copy non-string values as-is
        setValueByPath(targetData, key, sourceValue);
        translatedCount++;
      }
    }

    // Small delay between batches to respect API rate limits
    if (i + BATCH_SIZE < missingKeys.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Write updated target file
  fs.writeFileSync(targetFile, JSON.stringify(targetData, null, 2) + '\n', 'utf8');

  console.log(`\n✓ Successfully translated ${translatedCount}/${missingKeys.length} keys`);
  console.log(`✓ Updated ${targetFile}`);
}

/**
 * Main execution
 */
async function main() {
  console.log('='.repeat(60));
  console.log('DeepL Translation Sync');
  console.log('='.repeat(60));

  // Check for API key
  if (!process.env.DEEPL_API_KEY) {
    console.error('\n✗ Error: DEEPL_API_KEY environment variable not set');
    console.error('Please set your DeepL API key:');
    console.error('  export DEEPL_API_KEY=your_api_key_here\n');
    process.exit(1);
  }

  // Get list of target locales (all except source)
  const localeFiles = fs.readdirSync(LOCALES_DIR)
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''))
    .filter(locale => locale !== SOURCE_LOCALE);

  console.log(`\nSource locale: ${SOURCE_LOCALE}.json`);
  console.log(`Target locales: ${localeFiles.join(', ')}\n`);

  // Sync each locale
  for (const locale of localeFiles) {
    try {
      await syncLocale(locale);
    } catch (error) {
      console.error(`\n✗ Error syncing ${locale}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Translation sync complete!');
  console.log('='.repeat(60) + '\n');
}

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
