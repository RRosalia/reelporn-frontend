# Translation Management

This project uses automated translation syncing with DeepL API for maintaining multiple language locales.

## Supported Languages

- 🇬🇧 English (en) - **Source language**
- 🇪🇸 Spanish (es)
- 🇮🇹 Italian (it)
- 🇵🇱 Polish (pl)
- 🇵🇹 Portuguese (pt)
- 🇸🇪 Swedish (sv)
- 🇨🇿 Czech (cs)
- 🇩🇪 German (de)
- 🇫🇷 French (fr)
- 🇳🇱 Dutch (nl)

## How It Works

1. **Source File**: `src/i18n/locales/en.json` is the master translation file
2. **Auto-Translation**: When `en.json` is updated, GitHub Actions automatically:
   - Detects missing keys in other locale files
   - Translates them using DeepL API
   - Commits the updated translations

## Manual Translation Sync

### Prerequisites

```bash
# Install DeepL dependency
npm install --save-dev deepl-node

# Set your DeepL API key
export DEEPL_API_KEY=your_api_key_here
```

Get a free DeepL API key at: https://www.deepl.com/pro-api (500,000 chars/month free)

### Commands

```bash
# Sync all translations (translate missing keys)
npm run translate:sync

# Validate all translation files
npm run translate:validate
```

## GitHub Actions Setup

### 1. Add DeepL API Key to Secrets

1. Go to **Repository Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `DEEPL_API_KEY`
4. Value: Your DeepL API key
5. Click **Add secret**

### 2. Workflow Triggers

The translation workflow runs:
- **Automatically** when `src/i18n/locales/en.json` is modified and pushed
- **Manually** from the Actions tab → "Auto-translate Locales" → "Run workflow"

## Adding New Languages

To add a new language:

1. Add the language code to `DEEPL_LANG_MAP` in `scripts/sync-translations.js`:

```javascript
const DEEPL_LANG_MAP = {
  // ... existing languages
  'ja': 'JA',  // Japanese
  'ko': 'KO',  // Korean
};
```

2. Create an empty locale file:

```bash
echo '{}' > src/i18n/locales/ja.json
```

3. Update `src/i18n/routing.ts` to include the new locale:

```typescript
export const routing = defineRouting({
  locales: ['en', 'nl', 'de', 'fr', 'es', 'it', 'pl', 'pt', 'sv', 'cs', 'ja'],
  defaultLocale: 'en',
  // ...
});
```

4. Run the sync script:

```bash
npm run translate:sync
```

## Translation Quality

### DeepL Advantages
- High-quality neural machine translation
- Excellent for European languages
- Preserves formatting and special characters
- Context-aware translations

### Recommendations
- ✅ DeepL is excellent for general UI text
- ⚠️ Adult content terminology may need manual review
- ⚠️ Marketing copy should be reviewed by native speakers
- ⚠️ Legal text (Terms, Privacy) should be professionally translated

## File Structure

```
src/i18n/
├── locales/
│   ├── en.json          # Source (English)
│   ├── es.json          # Spanish
│   ├── it.json          # Italian
│   ├── pl.json          # Polish
│   ├── pt.json          # Portuguese
│   ├── sv.json          # Swedish
│   ├── cs.json          # Czech
│   ├── de.json          # German
│   ├── fr.json          # French
│   └── nl.json          # Dutch
└── routing.ts           # i18n routing configuration

scripts/
├── sync-translations.js     # DeepL sync script
└── validate-translations.js # Validation script

.github/workflows/
└── translate-locales.yml    # GitHub Actions workflow
```

## Troubleshooting

### API Key Issues

```bash
# Check if API key is set
echo $DEEPL_API_KEY

# Test API connection
node -e "const deepl = require('deepl-node'); new deepl.Translator(process.env.DEEPL_API_KEY).getUsage().then(console.log)"
```

### Validation Errors

```bash
# Check for JSON syntax errors
node -e "JSON.parse(require('fs').readFileSync('src/i18n/locales/es.json', 'utf8'))"

# Validate all translations
npm run translate:validate
```

### Manual Translation

If you need to manually translate specific keys:

1. Edit the target locale file directly
2. The auto-sync will preserve your manual translations
3. Only missing keys will be auto-translated

## Best Practices

1. **Always edit `en.json` first** - other locales sync from it
2. **Run validation before committing** - `npm run translate:validate`
3. **Review auto-translations** - especially for marketing/legal content
4. **Use consistent terminology** - maintain a glossary for brand terms
5. **Test in the application** - ensure translations fit in UI components

## DeepL API Limits

**Free Tier:**
- 500,000 characters/month
- Rate limit: ~10 translations/second

**Pro Tier:**
- Unlimited characters (pay per use)
- Higher rate limits
- Additional features

Monitor usage at: https://www.deepl.com/account/usage

## Support

For issues or questions:
- Check the [DeepL API documentation](https://developers.deepl.com/)
- Review GitHub Actions logs for errors
- Validate JSON syntax with `npm run translate:validate`
