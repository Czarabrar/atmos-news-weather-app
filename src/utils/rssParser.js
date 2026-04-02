/**
 * RSS Parser Utility
 * Parses RSS/Atom XML feeds into structured article objects.
 */
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
});

/**
 * Extract image URL from an RSS item using multiple fallback strategies.
 */
function extractImage(item) {
    // media:content
    if (item['media:content']) {
        const media = item['media:content'];
        if (Array.isArray(media)) {
            const img = media.find(m => m['@_medium'] === 'image' || m['@_url']);
            if (img) return img['@_url'];
        } else if (media['@_url']) {
            return media['@_url'];
        }
    }

    // media:thumbnail
    if (item['media:thumbnail'] && item['media:thumbnail']['@_url']) {
        return item['media:thumbnail']['@_url'];
    }

    // enclosure
    if (item.enclosure && item.enclosure['@_url']) {
        return item.enclosure['@_url'];
    }

    // image tag inside item
    if (item.image && typeof item.image === 'string') {
        return item.image;
    }

    // Extract from description HTML
    if (item.description) {
        const imgMatch = String(item.description).match(
            /src=["']([^"']+\.(?:jpg|jpeg|png|webp|gif)[^"']*)/i,
        );
        if (imgMatch) return imgMatch[1];
    }

    return null;
}

/**
 * Strip HTML tags from a string.
 */
function stripHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/<[^>]*>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .trim();
}

/**
 * Normalize a single RSS/Atom item into a consistent article shape.
 * @param {Object} item - Raw RSS item
 * @returns {Object} Normalized article
 */
export function normalizeItem(item) {
    const description = (() => {
        const raw = stripHtml(item.description || item.summary || '');
        return raw.length > 200 ? raw.substring(0, 200) + '...' : raw;
    })();

    const content = (() => {
        const raw = stripHtml(item['content:encoded'] || item.content || '');
        return raw.length > 500 ? raw.substring(0, 500) + '...' : raw || description;
    })();

    // Handle link - could be string or object (Atom feeds)
    let url = '';
    if (typeof item.link === 'string') {
        url = item.link;
    } else if (item.link && item.link['@_href']) {
        url = item.link['@_href'];
    } else if (item.guid) {
        url = typeof item.guid === 'string' ? item.guid : item.guid['#text'] || '';
    }

    return {
        title: stripHtml(item.title || ''),
        description,
        url,
        urlToImage: extractImage(item),
        author: item['dc:creator'] || item.author || null,
        content,
        publishedAt: item.pubDate || item.published || item.updated || null,
    };
}

/**
 * Parse an RSS/Atom XML string into an array of normalized articles.
 * @param {string} xml - Raw XML string
 * @returns {Array} Array of normalized article objects
 */
export function parseRssFeed(xml) {
    try {
        const result = parser.parse(xml);

        let items = [];

        // RSS 2.0 format
        if (result.rss && result.rss.channel) {
            items = result.rss.channel.item || [];
        }
        // Atom format
        else if (result.feed && result.feed.entry) {
            items = result.feed.entry || [];
        }
        // RDF format
        else if (result['rdf:RDF'] && result['rdf:RDF'].item) {
            items = result['rdf:RDF'].item || [];
        }

        // Ensure items is always an array (single item comes as object)
        if (!Array.isArray(items)) {
            items = [items];
        }

        return items.map(normalizeItem).filter(article => article.title);
    } catch (err) {
        console.error('[RSSParser] Parse error:', err);
        return [];
    }
}
