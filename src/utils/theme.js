/**
 * Premium Weather App Theme
 * Centralized design tokens: weather gradients, glassmorphism, typography, spacing.
 */

// ─── Weather → Gradient mapping ─────────────────────────────────────────────
const GRADIENTS = {
  Clear: ['#fc4a1a', '#f7b733', '#4a00e0'],
  Clouds: ['#4B79A1', '#283E51'],
  Rain: ['#0f2027', '#203a43', '#2c5364'],
  Drizzle: ['#0f2027', '#203a43', '#2c5364'],
  Thunderstorm: ['#000000', '#434343', '#0f0c29'],
  Snow: ['#1A2980', '#26D0CE'],
  Mist: ['#606c88', '#3f4c6b'],
  Haze: ['#606c88', '#3f4c6b'],
  Fog: ['#606c88', '#3f4c6b'],
  Smoke: ['#606c88', '#3f4c6b'],
  Dust: ['#8E4A23', '#D48166', '#372015'],
  Sand: ['#8E4A23', '#D48166', '#372015'],
  Ash: ['#606c88', '#3f4c6b'],
  Squall: ['#0f2027', '#203a43', '#2c5364'],
  Tornado: ['#000000', '#434343', '#0f0c29'],
  Night: ['#0F0C29', '#302B63', '#24243E'],
  Default: ['#4A90D9', '#667EEA', '#764BA2'],
};

/**
 * Returns gradient color array for a given weather condition.
 * Optionally pass the OpenWeather icon code – if it ends with 'n' we use Night.
 */
export const getWeatherGradient = (condition, iconCode) => {
  if (iconCode && iconCode.endsWith('n')) {
    return GRADIENTS.Night;
  }
  return GRADIENTS[condition] || GRADIENTS.Default;
};

// ─── Glassmorphism helpers ──────────────────────────────────────────────────

export const glass = {
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 24,
  },
  medium: {
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 20,
  },
  dark: {
    backgroundColor: 'rgba(0,0,0,0.20)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    borderRadius: 20,
  },
};

// ─── Category Colors ────────────────────────────────────────────────────────

export const categoryColors = {
  general: '#B39DDB',       // Pastel Purple
  business: '#81D4FA',      // Pastel Light Blue
  sports: '#FFAB91',        // Pastel Orange
  technology: '#A5D6A7',    // Pastel Green
  health: '#F48FB1',        // Pastel Pink
  entertainment: '#FFE082', // Pastel Yellow
  science: '#90CAF9',       // Pastel Blue
  education: '#CE93D8',     // Pastel Magenta
};

// ─── Typography ─────────────────────────────────────────────────────────────

export const typography = {
  heroTemp: {
    fontSize: 56,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subheading: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.75)',
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.6)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
};

// ─── Spacing ────────────────────────────────────────────────────────────────

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  screenPadding: 18,
};
