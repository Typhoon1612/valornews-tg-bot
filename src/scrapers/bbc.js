// filepath: src/scrapers/bbc.js
import BaseScraper from "./baseScraper.js";

/**
 * BBC News Scraper
 * Scrapes latest headlines from BBC News
 */
class BBCScraper extends BaseScraper {
  constructor() {
    super("BBC", "https://www.bbc.com");
    this.newsUrl = "https://www.bbc.com/news";
  }

  /**
   * Scrape BBC News headlines
   * @returns {Promise<Array<{title: string, url: string, summary: string}>>}
   */
  async scrape() {
    try {
      const html = await this.fetchHTML(this.newsUrl);
      const $ = this.parseHTML(html);
      const articles = [];

      // BBC uses various article containers - targeting common patterns
      $('article, [data-testid*="card"]').each((_, element) => {
        try {
          const $article = $(element);

          // Extract title from h2 or h3
          const $title = $article.find("h2, h3").first();
          const title = this.sanitizeText($title.text());

          if (!title) return;

          // Extract URL from first link
          const $link = $article.find("a").first();
          const href = $link.attr("href");
          const url = this.resolveUrl(href);

          // Extract summary from paragraph
          const $summary = $article.find("p").first();
          const summary = this.sanitizeText($summary.text());

          const article = { title, url, summary };

          if (this.isValidArticle(article)) {
            articles.push(article);
          }
        } catch (err) {
          // Skip malformed articles
        }
      });

      return articles;
    } catch (error) {
      console.error(`${this.name} scraper failed: ${error.message}`);
      throw new Error(`Failed to scrape ${this.name}: ${error.message}`);
    }
  }
}

export default BBCScraper;
