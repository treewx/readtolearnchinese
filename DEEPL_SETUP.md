# DeepL API Setup Guide

## Overview
The Chinese Learning App now uses DeepL API for superior Chinese translation accuracy. DeepL provides much better translations than the previous free APIs, especially for Chinese characters.

## Getting Your DeepL API Key

### Step 1: Sign up for DeepL API
1. Go to [https://www.deepl.com/pro-api](https://www.deepl.com/pro-api)
2. Click "Sign up for free"
3. Create your account
4. Verify your email address

### Step 2: Access Your API Key
1. Log in to your DeepL account
2. Go to your [Account Settings](https://www.deepl.com/account/summary)
3. Navigate to the "API" tab
4. Copy your Authentication Key

## Configuration

### Add API Key to Environment File
1. Open the `.env` file in the `chinese-learning-app` directory
2. Add your DeepL API key:
   ```
   REACT_APP_DEEPL_API_KEY=your_api_key_here:fx
   ```

**Important Notes:**
- Free tier API keys end with `:fx` (e.g., `abcd1234-5678-9012-3456-789012345678:fx`)
- Free tier keys automatically use the free DeepL API endpoint
- Paid tier keys don't have `:fx` suffix and use the standard API endpoint

## Free Tier Limits
- **500,000 characters per month** - very generous for personal use
- **API calls are free** until you hit the character limit
- **No time limits** - unused characters don't expire monthly

## Usage
Once configured, the app will:
1. **First** check the local Chinese dictionary (fastest, most accurate for common words)
2. **Then** use DeepL API for unknown words (high quality translations)
3. **Finally** fall back to character-by-character breakdown if needed

## Benefits Over Previous APIs
- **Much higher accuracy** for Chinese translations
- **Better context understanding** for compound words
- **Proper handling** of Chinese grammar and idioms
- **No more "Senggang" mistakes** like the old MyMemory API

## Testing
To test if it's working:
1. Start the app: `npm start`
2. Enter Chinese text with characters not in the local dictionary
3. Hover over characters to see tooltips
4. Check browser console for any DeepL API messages

## Troubleshooting
- **No translations appearing**: Check that your API key is correct in `.env`
- **"Authentication failed"**: Verify your API key is copied correctly
- **"Quota exceeded"**: You've used your 500,000 monthly characters
- **App falls back to local dictionary**: Normal behavior when API is unavailable

## Without API Key
The app works without a DeepL API key by using:
- Comprehensive local Chinese dictionary (500+ words)
- Character-by-character translations
- No external API calls

But DeepL API provides much better translations for:
- Compound words not in local dictionary
- Context-dependent translations
- Modern Chinese expressions