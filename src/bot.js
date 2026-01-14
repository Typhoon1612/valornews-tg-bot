// filepath: src/bot.js
import "dotenv/config";
import { Telegraf } from "telegraf";
import cron from "node-cron";
import { getNewArticles, markAsSent } from "./services/newsManager.js";

// Validate environment variables
if (!process.env.BOT_TOKEN) {
  console.error("❌ BOT_TOKEN is not set in .env");
  process.exit(1);
}

if (!process.env.CHANNEL_ID) {
  console.error("❌ CHANNEL_ID is not set in .env");
  process.exit(1);
}

// Initialize Telegraf bot
const bot = new Telegraf(process.env.BOT_TOKEN);
const CHANNEL_ID = process.env.CHANNEL_ID;

/**
 * Format article for Telegram message
 * @param {Object} article - Article object
 * @returns {string} Formatted message
 */
function formatMessage(article) {
  let message = `📰 *${escapeMarkdown(article.title)}*\n\n`;

  if (article.summary) {
    message += `${escapeMarkdown(article.summary)}\n\n`;
  }

  message += `🔗 [Read more](${article.url})`;

  return message;
}

/**
 * Escape special characters for Telegram MarkdownV2
 * @param {string} text
 * @returns {string}
 */
function escapeMarkdown(text) {
  return text.replace(/[_*\[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

/**
 * Main news fetching and posting job
 */
async function postNewsToChannel() {
  try {
    console.log("🔄 Running scheduled news check...");

    // Get new articles
    const articles = await getNewArticles();

    if (articles.length === 0) {
      console.log("ℹ️  No new articles to post");
      return;
    }

    console.log(`📬 Found ${articles.length} new article(s) to post`);

    // Post each article
    for (const article of articles) {
      try {
        const message = formatMessage(article);

        // Send message to channel
        await bot.telegram.sendMessage(CHANNEL_ID, message, {
          parse_mode: "MarkdownV2",
          disable_web_page_preview: false,
        });

        // CRITICAL: Only mark as sent AFTER successful send
        await markAsSent(article.url);

        console.log(`✅ Posted: ${article.title}`);

        // Rate limiting: Wait 2 seconds between posts
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`❌ Failed to post article: ${article.title}`);
        console.error(`   Error: ${error.message}`);
        // Don't mark as sent if posting failed
        // Article will be retried in next cycle
      }
    }

    console.log("✨ News posting cycle completed");
  } catch (error) {
    console.error("❌ Error in news posting job:", error.message);
  }
}

// Schedule job: Every 30 minutes
cron.schedule("*/30 * * * *", () => {
  console.log(`⏰ Cron triggered at ${new Date().toLocaleString()}`);
  postNewsToChannel();
});

// Graceful shutdown
process.once("SIGINT", () => {
  console.log("\n⚠️  Received SIGINT, shutting down gracefully...");
  bot.stop("SIGINT");
  process.exit(0);
});

process.once("SIGTERM", () => {
  console.log("\n⚠️  Received SIGTERM, shutting down gracefully...");
  bot.stop("SIGTERM");
  process.exit(0);
});

// Start bot
console.log("🤖 Bot started...");
console.log(`📢 Posting to channel: ${CHANNEL_ID}`);
console.log("⏰ Scheduled to run every 30 minutes");
console.log("Press Ctrl+C to stop\n");

// Run once immediately on startup
postNewsToChannel();
