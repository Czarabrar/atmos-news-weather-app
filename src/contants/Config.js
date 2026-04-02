export const WEATHER_API_KEY = '1edba02f91e8fd9a6cf4cc8da10ec507';

// RSS Feed URLs by language and category
// Each category has an array of feeds that get combined
export const RSS_FEEDS = {
    en: {
        general: [
            'https://www.thehindu.com/news/national/feeder/default.rss',
            'https://feeds.feedburner.com/ndtvnews-top-stories',
        ],
        business: [
            'https://www.thehindu.com/business/feeder/default.rss',
            'https://feeds.feedburner.com/ndtvprofit-latest',
        ],
        sports: [
            'https://www.thehindu.com/sport/feeder/default.rss',
            'https://feeds.feedburner.com/ndtvsports-latest',
        ],
        technology: [
            'https://www.thehindu.com/sci-tech/technology/feeder/default.rss',
            'https://feeds.feedburner.com/gadgets360-latest',
        ],
        health: [
            'https://www.thehindu.com/sci-tech/health/feeder/default.rss',
        ],
        entertainment: [
            'https://www.thehindu.com/entertainment/feeder/default.rss',
            'https://feeds.feedburner.com/ndtvmovies-latest',
        ],
        science: [
            'https://www.thehindu.com/sci-tech/science/feeder/default.rss',
        ],
        education: [
            'https://www.thehindu.com/education/feeder/default.rss',
        ],
    },
    ta: {
        general: [
            'https://news.google.com/rss/search?q=tamil+news&hl=ta&gl=IN&ceid=IN:ta',
            'https://feeds.bbci.co.uk/tamil/rss.xml',
        ],
        business: [
            'https://news.google.com/rss/search?q=business+technology&hl=ta&gl=IN&ceid=IN:ta',
        ],
        sports: [
            'https://news.google.com/rss/search?q=sports&hl=ta&gl=IN&ceid=IN:ta',
        ],
        technology: [
            'https://news.google.com/rss/search?q=technology&hl=ta&gl=IN&ceid=IN:ta',
        ],
        health: [
            'https://news.google.com/rss/search?q=health+fitness&hl=ta&gl=IN&ceid=IN:ta',
        ],
        entertainment: [
            'https://news.google.com/rss/search?q=cinema+entertainment&hl=ta&gl=IN&ceid=IN:ta',
        ],
        science: [
            'https://news.google.com/rss/search?q=science&hl=ta&gl=IN&ceid=IN:ta',
        ],
        education: [
            'https://news.google.com/rss/search?q=education+students&hl=ta&gl=IN&ceid=IN:ta',
        ],
    },
};

// Articles per page for pagination
export const PAGE_SIZE = 10;
