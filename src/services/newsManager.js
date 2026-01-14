import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import BbcScraper from '../scrapers/bbc.js'; // Ensure path is correct

// Fix for __dirname in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../../data/db.json');

let db = null;

/**
 * Initialize the Database
 */
async function initDatabase() {
    if (db) return db;

    // Ensure folder exists
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    // Initialize adapter
    const adapter = new JSONFile(DB_PATH);
    db = new Low(adapter, { sent_urls: [] });
    
    await db.read();
    
    // Set defaults if empty
    db.data ||= { sent_urls: [] };
    
    await db.write();
    return db;
}

/**
 * Main function to get ONLY new articles
 */
export async function getNewArticles() {
    try {
        await initDatabase();
        
        // 1. Run the Scraper
        const scraper = new BbcScraper();
        console.log(`📡 Fetching news from ${scraper.constructor.name}...`);
        const allArticles = await scraper.scrape();
        
        // 2. Filter Duplicates (But DO NOT mark as sent yet)
        const newArticles = allArticles.filter(article => {
            return !db.data.sent_urls.includes(article.url);
        });

        console.log(`✅ Found ${newArticles.length} new articles.`);
        return newArticles;

    } catch (error) {
        console.error('❌ Error in NewsManager:', error);
        return [];
    }
}

/**
 * Helper to mark a SPECIFIC url as sent (Call this AFTER telegram sends it)
 */
export async function markAsSent(url) {
    if (!db) await initDatabase();
    
    if (!db.data.sent_urls.includes(url)) {
        db.data.sent_urls.push(url);
        await db.write();
    }
}