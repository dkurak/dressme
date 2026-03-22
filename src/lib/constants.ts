export const APP_NAME = 'DressMe';
export const APP_DESCRIPTION = 'Build outfits, compare looks, decide what to buy.';

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '\u20AC',
  GBP: '\u00A3',
};

export function formatPrice(price: number | null, currency = 'USD'): string {
  if (price === null) return '';
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  return `${symbol}${price.toFixed(2)}`;
}
