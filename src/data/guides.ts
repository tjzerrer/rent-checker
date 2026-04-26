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
  }
];

export const getGuide = (slug: string) => guides.find((guide) => guide.slug === slug);
