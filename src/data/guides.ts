export type Guide = {
  slug: string;
  title: string;
  pageTitle: string;
  description: string;
  h1: string;
  intro: string;
};

export const guides: Guide[] = [
  {
    slug: "how-to-estimate-rent",
    title: "How to Estimate Rent for Your Property | Rent Estimate Guide",
    pageTitle: "How to Estimate Rent for Your Property",
    description:
      "Learn how to estimate rent using square footage, bedrooms, condition, comparable rentals, and market position. Use rent calculators to set a smarter price.",
    h1: "How to Estimate Rent for Your Property (Step-by-Step)",
    intro:
      "A practical guide to estimating rent with square footage, property details, comparable rentals, and market position."
  },
  {
    slug: "rent-price-per-square-foot",
    title: "What Is a Good Rent Price Per Square Foot? | Rent Guide",
    pageTitle: "What Is a Good Price Per Square Foot for Rent?",
    description:
      "Learn how to calculate rent per square foot, compare rental properties, and determine if your rent is competitive using real data.",
    h1: "What Is a Good Price Per Square Foot for Rent?",
    intro:
      "Learn how price per square foot helps compare rentals, build a market range, and check whether rent is competitive."
  },
  {
    slug: "compare-rental-properties",
    title: "How to Compare Rental Properties | Rent Comparison Guide",
    pageTitle: "How to Compare Rental Properties Like an Investor",
    description:
      "Learn how to compare rental properties using rent, square footage, and price per square foot. Make better rent decisions with data and tools.",
    h1: "How to Compare Rental Properties Like an Investor",
    intro:
      "Learn how to compare rentals with consistent data, price per square foot, and market-position checks before pricing a property."
  }
];

export const getGuide = (slug: string) => guides.find((guide) => guide.slug === slug);
