// filepath: src/scrapers/baseScraper.js
import axios from "axios";
import * as cheerio from "cheerio";

/**
 * Abstract Base Scraper
 * Defines the contract for all news scrapers
 */
class BaseScraper {
  constructor(name, baseUrl) {
    if (this.constructor === BaseScraper) {
      throw new Error(
        "BaseScraper is abstract and cannot be instantiated directly"
      );
    }
    this.name = name;
    this.baseUrl = baseUrl;
    this.timeout = 10000;
  }

  /**
   * Abstract method - must be implemented by subclasses
   * @returns {Promise<Array<{title: string, url: string, summary: string}>>}
   */
  async scrape() {
    throw new Error("scrape() must be implemented by subclass");
  }

  /**
   * Fetch HTML content from URL
   * @param {string} url
   * @returns {Promise<string>}
   */
  async fetchHTML(url) {
    const response = await axios.get(url, {
      timeout: this.timeout,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    return response.data;
  }

  /**
   * Parse HTML with Cheerio
   * @param {string} html
   * @returns {CheerioAPI}
   */
  parseHTML(html) {
    return cheerio.load(html);
  }

  /**
   * Resolve relative URL to absolute
   * @param {string} url
   * @returns {string}
   */
  resolveUrl(url) {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    if (url.startsWith("//")) {
      return `https:${url}`;
    }
    return new URL(url, this.baseUrl).href;
  }

  /**
   * Sanitize text content
   * @param {string} text
   * @returns {string}
   */
  sanitizeText(text) {
    if (!text) return "";
    return text.trim().replace(/\s+/g, " ");
  }

  /**
   * Validate article structure
   * @param {Object} article
   * @returns {boolean}
   */
  isValidArticle(article) {
    return (
      article &&
      typeof article.title === "string" &&
      article.title.length > 0 &&
      typeof article.url === "string" &&
      article.url.startsWith("http") &&
      typeof article.summary === "string"
    );
  }
}

export default BaseScraper;
