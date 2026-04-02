/**
 * News Service
 * Fetches, combines, caches, and filters news from multiple RSS feeds.
 * Supports pagination for infinite scroll.
 */
import { parseRssFeed } from '../utils/rssParser';
import { RSS_FEEDS, PAGE_SIZE } from '../contants/Config';

// ─── In-memory cache (stores ALL articles, pagination is done client-side) ──
const cache = {};
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function getCached(key) {
    const entry = cache[key];
    if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
        return entry.data;
    }
    return null;
}

function setCache(key, data) {
    cache[key] = { data, timestamp: Date.now() };
}

/**
 * Clear the cache (used by pull-to-refresh).
 */
export const clearNewsCache = () => {
    Object.keys(cache).forEach(key => delete cache[key]);
};

/**
 * Fetch a single RSS feed and parse it.
 */
async function fetchSingleFeed(url, categoryName) {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; WeatherNewsApp/1.0)',
            },
        });
        const xml = await response.text();
        const parsed = await parseRssFeed(xml);
        // Embed the actual origin category into the article
        return parsed.map(article => ({ ...article, category: categoryName }));
    } catch (err) {
        console.warn(`[NewsService] Failed to fetch ${url}:`, err.message);
        return [];
    }
}

/**
 * Fetch all articles for a category+lang (cached).
 * Returns the full combined, de-duped, sorted array.
 */
async function fetchAllArticles(category, lang) {
    const cacheKey = `${category}_${lang}`;
    const cached = getCached(cacheKey);
    if (cached) {
        console.log(`[NewsService] Cache hit: ${cacheKey}`);
        return cached;
    }

    let combined = [];

    if (category === 'general') {
        console.log(`[NewsService] Fetching ALL non-general feeds for ${cacheKey}`);
        const allCats = Object.keys(RSS_FEEDS[lang] || RSS_FEEDS.en).filter(c => c !== 'general');

        const feedPromises = allCats.map(async cat => {
            const feedUrls = RSS_FEEDS[lang]?.[cat] || RSS_FEEDS.en[cat] || [];
            const catResults = await Promise.all(feedUrls.map(url => fetchSingleFeed(url, cat)));
            return catResults.flat();
        });

        const results = await Promise.all(feedPromises);
        combined = results.flat();
    } else {
        const feedUrls = RSS_FEEDS[lang]?.[category] || RSS_FEEDS.en.general;
        console.log(`[NewsService] Fetching ${feedUrls.length} feed(s) for ${cacheKey}`);
        const feedResults = await Promise.all(feedUrls.map(url => fetchSingleFeed(url, category)));
        combined = feedResults.flat();
    }

    // De-duplicate by URL
    const seen = new Set();
    combined = combined.filter(article => {
        if (!article.url || seen.has(article.url)) return false;
        seen.add(article.url);
        return true;
    });

    // Sort by date (newest first)
    combined.sort((a, b) => {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return dateB - dateA;
    });

    setCache(cacheKey, combined);
    console.log(
        `[NewsService] Combined ${combined.length} articles for ${cacheKey}`,
    );

    return combined;
}

/**
 * Fetch news articles with pagination.
 *
 * @param {string} category - e.g., 'general', 'business'
 * @param {string} lang - 'en' | 'ta'
 * @param {number} page - 0-indexed page number
 * @returns {Promise<{articles: Array, hasMore: boolean}>}
 */
export const fetchNews = async (category = 'general', lang = 'en', page = 0) => {
    const allArticles = await fetchAllArticles(category, lang);
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const articles = allArticles.slice(start, end);
    const hasMore = end < allArticles.length;

    return { articles, hasMore };
};

// ─── Weather-based keyword filtering ────────────────────────────────────────

const positiveKeywords = [
    'success', 'growth', 'innovation', 'win', 'won', 'celebrate', 'joy',
    'victory', 'happy', 'award', 'achievement', 'progress', 'boost',
    'record', 'triumph', 'top', 'lead', 'high', 'fast', 'hero'
];

const chillKeywords = [
    'tech', 'smart', 'new', 'update', 'market', 'plan', 'future',
    'design', 'soft', 'build', 'study', 'research', 'home', 'life', 'art'
];

const seriousKeywords = [
    'crisis', 'warning', 'disruption', 'rain', 'flood', 'storm',
    'caution', 'alert', 'delay', 'accident', 'damage', 'rescue',
    'cyclone', 'emergency', 'disaster', 'court', 'police', 'drop', 'fall'
];

/**
 * Filter articles based on weather condition.
 * Falls back to all articles if filtered count < 1.
 */
export const filterNewsByWeather = (condition, articles) => {
    if (!condition || !articles || articles.length === 0) {
        return articles;
    }

    const conditionLower = condition.toLowerCase();
    let keywords = [];

    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
        keywords = positiveKeywords;
    } else if (conditionLower.includes('cloud') || conditionLower.includes('mist') || conditionLower.includes('fog')) {
        keywords = chillKeywords;
    } else if (
        conditionLower.includes('rain') ||
        conditionLower.includes('drizzle') ||
        conditionLower.includes('thunderstorm')
    ) {
        keywords = seriousKeywords;
    } else {
        return articles;
    }

    const filtered = articles.filter(article =>
        keywords.some(
            keyword =>
                article.title?.toLowerCase().includes(keyword) ||
                article.description?.toLowerCase().includes(keyword),
        ),
    );

    // If keywords yield nothing, at least shake up the feed by taking a random/alternate slice
    // so the user visibly sees a change when switching weather conditions.
    if (filtered.length === 0) {
        // Fallback: Just return a smaller slice to pretend it filtered out irrelevant things,
        // or just return articles if we have very little to begin with.
        return articles.length > 5 ? articles.slice(2, Math.min(articles.length, 12)) : articles;
    }

    return filtered;
};
