# HealthConnect AI — Telegram Bot

## Setup
1. Create a Telegram bot via BotFather → copy the token.
2. In this folder, create/edit `.env` and add:
```
TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
```
3. Install deps (already added):
```
npm install
```

## Run (long-polling)
```
node bot.js
```
The bot will start and handle messages directly (no webhook required).

## Features
- Symptom checks (fever, headache, cough, chest pain)
- First-aid guidance (cuts, burns)
- Wellness advice (diet, exercise, diabetes, hypertension)
- Hindi/English auto-detection

## Deploy (webhook optional)
- For webhook hosting, use Telegraf webhook docs and `bot.telegram.setWebhook` with your HTTPS endpoint, then forward updates to `bot.handleUpdate`.
