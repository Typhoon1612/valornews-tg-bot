# 🤖 Valornews Telegram Bot

A Telegram bot that automatically scrapes Web3 news from various sources and posts them to your Telegram channel on a scheduled basis.

## 🚀 Features

- **Automated News Scraping**: Fetches latest news from BBC and other sources
- **Web3 Focused**: Filters content related to cryptocurrency, blockchain, NFTs, and DeFi
- **Deduplication**: Prevents posting duplicate articles using persistent storage
- **Scheduled Posting**: Runs every 30 minutes automatically
- **Telegram Integration**: Posts formatted messages with links to your channel
- **Error Handling**: Graceful error handling with retry logic
- **ES Modules**: Modern JavaScript with ES module support

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Language**: JavaScript (ES Modules)
- **Web Scraping**: Axios + Cheerio
- **Database**: LowDB (JSON file-based)
- **Bot Framework**: Telegraf
- **Scheduling**: node-cron
- **Environment**: dotenv

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Telegram Bot Token (from [@BotFather](https://t.me/botfather))
- A Telegram Channel to post to

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Typhoon1612/valornews-tg-bot.git
   cd valornews-tg-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your actual values:
   ```env
   BOT_TOKEN=your_bot_token_from_botfather
   CHANNEL_ID=@your_channel_username
   ```

## ⚙️ Configuration

### Getting a Telegram Bot Token

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot` and follow the instructions
3. Copy the token and paste it in your `.env` file

### Setting up a Telegram Channel

1. Create a new channel on Telegram
2. Add your bot as an administrator
3. Get the channel username (e.g., `@mychannel`)
4. Add it to your `.env` file as `CHANNEL_ID`

## 🎯 Usage

### Development
```bash
npm start
```

The bot will:
- Start immediately and post any new articles
- Run every 30 minutes to check for new content
- Log all activities to the console
- Handle errors gracefully without crashing

### Testing the Scraper
You can test the news scraping functionality independently:
```bash
node -e "import('./src/services/newsManager.js').then(m => m.getNewArticles().then(console.log))"
```

## 📁 Project Structure

```
valornews-tg-bot/
├── src/
│   ├── bot.js                 # Main Telegram bot application
│   ├── services/
│   │   └── newsManager.js     # News fetching and deduplication logic
│   └── scrapers/
│       ├── baseScraper.js     # Abstract base scraper class
│       ├── bbc.js            # BBC news scraper implementation
│       └── index.js          # Scraper exports
├── data/
│   └── db.json               # LowDB database (auto-generated)
├── .env                      # Environment variables (create from .env.example)
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies and scripts
├── README.md                # This file
├── VISION.md                # Project vision and requirements
└── CLAUDE.md                # Development guidelines
```

## 🔧 How It Works

1. **Scraping**: The bot uses Axios to fetch HTML from news sources and Cheerio to parse the content
2. **Filtering**: Articles are filtered for Web3/blockchain/crypto relevance
3. **Deduplication**: Each article URL is checked against a local database to prevent duplicates
4. **Formatting**: Articles are formatted with Markdown for Telegram
5. **Posting**: New articles are posted to your Telegram channel
6. **Persistence**: Successfully posted URLs are saved to prevent future duplicates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Adding New Scrapers

1. Create a new scraper in `src/scrapers/your-scraper.js`
2. Extend the `BaseScraper` class
3. Implement the `scrape()` method returning `{title, url, summary}` objects
4. Export it in `src/scrapers/index.js`
5. Update the newsManager to use your scraper

## 📝 Development Guidelines

This project follows strict engineering principles defined in `CLAUDE.md`:

- **SOLID Principles**: Single responsibility, open/closed, etc.
- **Clean Code**: Semantic naming, pure functions, guard clauses
- **Error Handling**: Fail fast, no silent failures
- **Security**: Never hardcode secrets, validate inputs

## 🚨 Important Notes

- **Rate Limiting**: The bot posts with 2-second delays to avoid Telegram rate limits
- **Data Privacy**: No user data is collected or stored
- **API Limits**: Respect website terms of service and implement delays between requests
- **Monitoring**: Check console logs for errors and successful posts

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

## 🙏 Acknowledgments

- [Telegraf](https://telegraf.js.org/) - Telegram Bot Framework
- [Cheerio](https://cheerio.js.org/) - jQuery-like HTML parsing
- [LowDB](https://github.com/typicode/lowdb) - Lightweight JSON database

---

**Made with ❤️ for the Web3 community**