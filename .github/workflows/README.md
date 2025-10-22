# GitHub Actions Workflows

## Auto-translate Locales

This workflow automatically translates missing keys in locale files using DeepL API.

### Setup

1. **Get a DeepL API Key**
   - Sign up at [DeepL API](https://www.deepl.com/pro-api)
   - Get your API key from the account dashboard
   - Free tier: 500,000 characters/month

2. **Add API Key to GitHub Secrets**
   - Go to your repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `DEEPL_API_KEY`
   - Value: Your DeepL API key
   - Click "Add secret"

3. **How It Works**
   - The workflow runs automatically when `src/i18n/locales/en.json` is modified
   - It can also be triggered manually from the Actions tab
   - Compares `en.json` with all other locale files
   - Translates missing keys using DeepL API
   - Commits and pushes the updated translations

### Supported Languages

- Spanish (es)
- Italian (it)
- Polish (pl)
- Portuguese (pt)
- Swedish (sv)
- Czech (cs)
- German (de)
- French (fr)
- Dutch (nl)

### Manual Run

You can also run the translation script locally:

```bash
# Install dependencies
npm install --save-dev deepl-node

# Set your API key
export DEEPL_API_KEY=your_api_key_here

# Run the script
node scripts/sync-translations.js
```

### Notes

- DeepL provides high-quality translations, especially for European languages
- For adult content terminology, manual review is recommended
- The script preserves formatting and special characters
- Empty or already-translated keys are skipped
