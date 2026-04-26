export type ToolField = {
  id: string;
  label: string;
  type: "number" | "select";
  unit?: "$" | "sq ft";
  size: "compact" | "medium";
  required?: boolean;
  message?: string;
  min?: number;
  step?: string;
  options?: { label: string; value: string }[];
};

export type Tool = {
  slug: string;
  type: "rent-estimate" | "rent-comparison" | "market-rent-analysis";
  title: string;
  pageTitle: string;
  description: string;
  h1: string;
  intro: string;
  inputTitle: string;
  fields: ToolField[];
  formulas: { label: string; value: string }[];
  steps: string[];
  example: string[];
  faqs: { question: string; answer: string }[];
  related: string[];
  methodology: string;
};

export const tools: Tool[] = [
  {
    slug: "rent-estimate",
    type: "rent-estimate",
    title: "Rent Estimate Calculator | Rent Checker",
    pageTitle: "Rent Estimate Calculator",
    description:
      "Estimate a monthly rent range from bedrooms, bathrooms, square footage, property type, and condition.",
    h1: "Rent Estimate Calculator",
    intro: "Estimate a practical monthly rent range from a few property details.",
    inputTitle: "Property details",
    fields: [
      { id: "bedrooms", label: "Bedrooms", type: "number", size: "compact", required: true, min: 0, step: "1", message: "Please enter bedrooms." },
      { id: "bathrooms", label: "Bathrooms", type: "number", size: "compact", required: true, min: 0, step: "0.5", message: "Please enter bathrooms." },
      { id: "squareFeet", label: "Square footage", type: "number", unit: "sq ft", size: "medium", required: true, min: 1, step: "1", message: "Please enter square footage." },
      {
        id: "propertyType",
        label: "Property type",
        type: "select",
        size: "medium",
        required: true,
        message: "Please choose a property type.",
        options: [
          { label: "Apartment", value: "apartment" },
          { label: "House", value: "house" },
          { label: "Duplex", value: "duplex" },
          { label: "Townhouse", value: "townhouse" },
          { label: "Condo", value: "condo" }
        ]
      },
      {
        id: "condition",
        label: "Condition",
        type: "select",
        size: "medium",
        options: [
          { label: "Average", value: "average" },
          { label: "Basic", value: "basic" },
          { label: "Premium", value: "premium" }
        ]
      }
    ],
    formulas: [
      { label: "Estimated rent", value: "Base rent per sq ft x square footage + room adjustments" },
      { label: "Rent range", value: "Midpoint +/- 10%" },
      { label: "Price per sq ft", value: "Estimated rent / square footage" }
    ],
    steps: [
      "Start with a simple base rent per square foot by property type.",
      "Adjust the estimate for bedrooms, bathrooms, and condition.",
      "Show a low, midpoint, and high range so the estimate is not over-precise."
    ],
    example: [
      "A 2-bedroom, 2-bath apartment with 1,000 square feet in average condition estimates near $1,760 per month.",
      "The displayed range shows about 10% below and above that midpoint."
    ],
    faqs: [
      { question: "Is this a real market rent appraisal?", answer: "No. It is a planning estimate based on simple assumptions, not a professional appraisal or live market feed." },
      { question: "Why does the calculator show a range?", answer: "Rent varies by location, timing, amenities, and lease terms. A range is more honest than a single exact number." },
      { question: "Can I use this before listing a rental?", answer: "Yes, as an early planning check. Compare it with real nearby listings before making a final decision." },
      { question: "Does condition matter?", answer: "Yes. A premium unit can usually support more rent than a basic unit with similar size and layout." }
    ],
    related: ["rent-comparison", "market-rent-analysis"],
    methodology: "The estimate uses a simple heuristic model with base rates by property type, room adjustments, and a condition multiplier."
  },
  {
    slug: "rent-comparison",
    type: "rent-comparison",
    title: "Rent Comparison Tool | Compare Rental Properties",
    pageTitle: "Rent Comparison Tool",
    description:
      "Compare rental properties side-by-side by rent, square footage, bedrooms, bathrooms, and price per square foot.",
    h1: "Rent Comparison Tool",
    intro: "Compare 2 to 5 rentals side-by-side and spot price-per-square-foot differences.",
    inputTitle: "Rental properties",
    fields: [],
    formulas: [
      { label: "Price per sq ft", value: "Rent / square footage" },
      { label: "Average rent", value: "Total rent across properties / number of properties" }
    ],
    steps: [
      "Calculate price per square foot for each property.",
      "Find the average rent across the group.",
      "Flag the lowest and highest rent so the spread is easy to see."
    ],
    example: [
      "If three rentals are $1,200, $1,600, and $1,400, the average rent is $1,400.",
      "A $1,200 rental with 800 square feet is $1.50 per square foot."
    ],
    faqs: [
      { question: "How many rentals should I compare?", answer: "Two is enough for a quick comparison, but three to five gives better context." },
      { question: "Should I compare price per square foot?", answer: "Yes. It helps normalize rentals that are different sizes." },
      { question: "Does the tool account for amenities?", answer: "No. Use the table as a math check, then consider amenities and location separately." }
    ],
    related: ["rent-estimate", "market-rent-analysis"],
    methodology: "The comparison uses only the values entered manually. It does not scrape listings or pull live rental data."
  },
  {
    slug: "market-rent-analysis",
    type: "market-rent-analysis",
    title: "Market Rent Analysis | Above or Below Market Rent",
    pageTitle: "Market Rent Analysis",
    description:
      "Compare your rent with an estimated market rent and see whether it is above or below typical estimates.",
    h1: "Market Rent Analysis",
    intro: "Check whether a rent amount is above or below an estimated market rent.",
    inputTitle: "Rent comparison",
    fields: [
      { id: "userRent", label: "Your rent", type: "number", unit: "$", size: "medium", required: true, min: 0, step: "1", message: "Please enter rent." },
      { id: "marketRent", label: "Estimated market rent", type: "number", unit: "$", size: "medium", required: true, min: 1, step: "1", message: "Please enter estimated market rent." },
      { id: "squareFeet", label: "Square footage", type: "number", unit: "sq ft", size: "medium", required: true, min: 1, step: "1", message: "Please enter square footage." }
    ],
    formulas: [
      { label: "Difference", value: "Your rent - estimated market rent" },
      { label: "% above or below", value: "Difference / estimated market rent x 100" },
      { label: "Price per sq ft", value: "Rent / square footage" }
    ],
    steps: [
      "Compare your rent with the estimated market rent.",
      "Convert the difference into a percentage.",
      "Compare price per square foot for another simple check."
    ],
    example: [
      "If your rent is $1,800 and the estimate is $1,600, your rent is $200 higher.",
      "That is 12.50% above the estimate."
    ],
    faqs: [
      { question: "What should I use for estimated market rent?", answer: "Use a nearby comparable estimate, your result from the rent estimate calculator, or a manual market assumption." },
      { question: "Is above market always bad?", answer: "Not always. A better location, newer finishes, or included utilities can explain a higher rent." },
      { question: "Why compare price per square foot?", answer: "It helps compare homes of different sizes more fairly." }
    ],
    related: ["rent-estimate", "rent-comparison"],
    methodology: "This analysis compares manually entered rents. It is a planning tool, not a legal, appraisal, or market-data service."
  }
];

export const getTool = (slug: string) => tools.find((tool) => tool.slug === slug);
