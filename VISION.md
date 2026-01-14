# VISION.md - Project Passport

## 🚀 Project Overview
- **Project Name:** Valornews Telegram Bot
- **One-Liner:** A Telegram bot that gets Web3 news data from the internet and posts it into the Telegram Channel.
- **Goal:**To share Web3 news to the audience in our Telegram Channel.

## 🎯 Core Features (MVP)
Feature 1:
Fetch web3 news data from free news sources link.

Feature 2:
Post it to the Telegram Bot.

Feature 3:
Randomly pick a news source link, and pull web3 news content from the news source link picked.

Feature 4:
Using ChatGPT API to rephrase the web3 news data before post.


## 🛠 Tech Stack
- **Language:** TypeScript
- **Key Libraries:** Telegraf
- **Environment:** Docker / Telegram Bot ID/ Render

## 🧠 Design & Architecture Guidelines
-  **Architecture:** Monolith
- **Data Flow:** [Randomly Pick a link → Fetch Data from the link → Rephrase →Post to Telegram Channel] 

## 📝 Current Status & Context
- **Phase:** Starting from scratch
- **Known Constraints:** Must run on a $5 VPS, Strict API rate limits
- **Secrets:** All API keys are in `.env` (See `.env.example`).




