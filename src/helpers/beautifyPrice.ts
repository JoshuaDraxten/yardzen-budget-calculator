// $6M – $10M is much easier to read than $6,000,000 – $10,000,000
export default function beautifyPrice(price: number, notation: string) {
  // Detect locale to display the currencly unambiguously as USD
  let locale = "en-US";
  if (navigator.languages) {
    locale = navigator.languages[0];
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    notation,
  }).format(price / 100);
}
