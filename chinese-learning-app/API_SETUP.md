# AI Topic Generator API Setup

The AI Topic Generator can use OpenAI's API to generate much more varied and intelligent Chinese text content for language learning.

## Setup Instructions

### 1. Get an OpenAI API Key
1. Go to [OpenAI's API Keys page](https://platform.openai.com/api-keys)
2. Sign up or log in to your OpenAI account
3. Click "Create new secret key"
4. Copy the key (it starts with `sk-...`)

### 2. Configure the Environment
1. Open the `.env` file in the `chinese-learning-app` folder
2. Replace the empty value with your API key:
   ```
   REACT_APP_OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

### 3. Optional Configuration
You can also adjust these settings in the `.env` file:
```
REACT_APP_AI_MODEL=gpt-3.5-turbo          # or gpt-4 for better quality
REACT_APP_MAX_TOKENS=200                   # Length of generated text
REACT_APP_TEMPERATURE=0.7                  # Creativity level (0.0-2.0)
```

### 4. Restart the App
After adding your API key:
1. Stop the development server (Ctrl+C)
2. Restart with `npm start`

## How to Test

1. Open the AI Topic Generator in the app
2. Look for the status message - should show "✅ OpenAI API key configured"
3. Try generating text for different topics
4. Check the browser console for API success messages

## Cost Information

- **gpt-3.5-turbo**: Very affordable (~$0.002 per generation)
- **gpt-4**: Higher quality but more expensive (~$0.06 per generation)
- For typical usage, costs should be minimal

## Troubleshooting

**"No API key found"** - Check that your `.env` file has the correct key
**API errors** - Check the browser console for specific error messages
**Still getting fallback** - Make sure you restarted the development server

## Security Note

Your API key is protected:
- The `.env` file is added to `.gitignore` 
- The key is not included in the built app
- Only you have access to your API key