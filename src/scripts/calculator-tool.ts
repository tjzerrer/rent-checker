import {
  calculateMarketRentAnalysis,
  calculateRentComparison,
  calculateRentEstimate,
  roundMoney,
  roundPercent
} from "../lib/calculators";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

function parseNumber(value: string) {
  return Number(value.replace(/,/g, ""));
}

function formatNumberInput(input: HTMLInputElement) {
  const raw = input.value.replace(/,/g, "");
  if (raw === "" || raw === "-" || raw.endsWith(".")) return;
  const value = Number(raw);
  if (Number.isNaN(value)) return;
  const decimals = raw.includes(".") ? raw.split(".")[1]?.length ?? 0 : 0;
  input.value = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: Math.max(decimals, 0)
  }).format(value);
}

function readValue(root: Element, id: string) {
  const input = root.querySelector<HTMLInputElement | HTMLSelectElement>(`[data-input="${id}"]`);
  return input?.value.trim() ?? "";
}

function setError(input: HTMLInputElement | HTMLSelectElement, message?: string) {
  const field = input.closest<HTMLElement>(".input-field");
  if (!field) return;
  field.classList.add("has-error");
  input.setAttribute("aria-invalid", "true");
  const error = field.querySelector<HTMLElement>(".field-error");
  if (error && message) error.textContent = message;
}

function clearErrors(root: Element) {
  root.querySelectorAll<HTMLElement>(".input-field.has-error").forEach((field) => {
    field.classList.remove("has-error");
    field.querySelector("input, select")?.removeAttribute("aria-invalid");
  });
}

function requireNumber(root: Element, id: string, message: string, min?: number) {
  const input = root.querySelector<HTMLInputElement>(`[data-input="${id}"]`);
  const value = input ? parseNumber(input.value) : NaN;
  if (!input || input.value.trim() === "" || Number.isNaN(value) || (min !== undefined && value < min)) {
    if (input) setError(input, message);
    return null;
  }
  return value;
}

function renderRows(rows: { label: string; value: string }[]) {
  return `<div class="result-list">${rows
    .map((row) => `<div class="result-row"><span>${row.label}</span><strong>${row.value}</strong></div>`)
    .join("")}</div>`;
}

function renderRentEstimate(root: Element, result: HTMLElement) {
  const bedrooms = requireNumber(root, "bedrooms", "Please enter bedrooms.", 0);
  const bathrooms = requireNumber(root, "bathrooms", "Please enter bathrooms.", 0);
  const squareFeet = requireNumber(root, "squareFeet", "Please enter square footage.", 1);
  if (bedrooms === null || bathrooms === null || squareFeet === null) return;

  const estimate = calculateRentEstimate({
    bedrooms,
    bathrooms,
    squareFeet,
    propertyType: readValue(root, "propertyType") || "apartment",
    condition: readValue(root, "condition") || "average"
  });

  result.innerHTML = `
    <div class="result-value">${money.format(roundMoney(estimate.midpoint))}</div>
    <p class="result-muted">Estimated midpoint monthly rent. A practical range is ${money.format(roundMoney(estimate.low))} to ${money.format(roundMoney(estimate.high))}.</p>
    ${renderRows([
      { label: "Low range", value: money.format(roundMoney(estimate.low)) },
      { label: "Midpoint", value: money.format(roundMoney(estimate.midpoint)) },
      { label: "High range", value: money.format(roundMoney(estimate.high)) },
      { label: "Price per sq ft", value: money.format(roundMoney(estimate.pricePerSqFt)) }
    ])}
  `;
}

function renderRentComparison(root: Element, result: HTMLElement) {
  const properties = [];
  for (let index = 0; index < 3; index += 1) {
    const group = root.querySelector(`[data-field="p${index}-rent"]`)?.closest("fieldset") ?? root;
    const rentInput = group.querySelector<HTMLInputElement>(`[data-input="rent"]`);
    const sqftInput = group.querySelector<HTMLInputElement>(`[data-input="squareFeet"]`);
    const bedroomsInput = group.querySelector<HTMLInputElement>(`[data-input="bedrooms"]`);
    const bathroomsInput = group.querySelector<HTMLInputElement>(`[data-input="bathrooms"]`);
    const rent = parseNumber(rentInput?.value ?? "");
    const squareFeet = parseNumber(sqftInput?.value ?? "");
    const bedrooms = parseNumber(bedroomsInput?.value ?? "");
    const bathrooms = parseNumber(bathroomsInput?.value ?? "");

    if (!rentInput?.value || !sqftInput?.value || squareFeet <= 0 || !bedroomsInput?.value || !bathroomsInput?.value) {
      [rentInput, sqftInput, bedroomsInput, bathroomsInput].forEach((input) => {
        if (input && !input.value) setError(input, "This field is required.");
      });
      return;
    }

    properties.push({ rent, squareFeet, bedrooms, bathrooms });
  }

  const comparison = calculateRentComparison(properties);
  const tableRows = comparison.rows
    .map((row) => {
      const note = row.index === comparison.cheapestIndex ? "Cheapest" : row.index === comparison.mostExpensiveIndex ? "Most expensive" : "";
      return `<tr><td>Property ${row.index + 1}</td><td>${money.format(row.rent)}</td><td>${number.format(row.squareFeet)}</td><td>${money.format(roundMoney(row.pricePerSqFt))}</td><td>${note}</td></tr>`;
    })
    .join("");

  result.innerHTML = `
    <div class="result-value">${money.format(roundMoney(comparison.averageRent))}</div>
    <p class="result-muted">Average rent across the properties you entered.</p>
    <table class="comparison-table">
      <thead><tr><th>Property</th><th>Rent</th><th>Sq ft</th><th>$/sq ft</th><th>Note</th></tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
  `;
}

function renderMarketAnalysis(root: Element, result: HTMLElement) {
  const userRent = requireNumber(root, "userRent", "Please enter rent.", 0);
  const marketRent = requireNumber(root, "marketRent", "Please enter estimated market rent.", 1);
  const squareFeet = requireNumber(root, "squareFeet", "Please enter square footage.", 1);
  if (userRent === null || marketRent === null || squareFeet === null) return;

  const analysis = calculateMarketRentAnalysis(userRent, marketRent, squareFeet);
  const direction = analysis.difference >= 0 ? "above" : "below";

  result.innerHTML = `
    <div class="result-value">${roundPercent(Math.abs(analysis.percentDifference)).toFixed(2)}% ${direction}</div>
    <p class="result-muted">You are pricing ${roundPercent(Math.abs(analysis.percentDifference)).toFixed(2)}% ${direction} the estimate entered.</p>
    ${renderRows([
      { label: "Dollar difference", value: money.format(roundMoney(analysis.difference)) },
      { label: "Your price per sq ft", value: money.format(roundMoney(analysis.userPricePerSqFt)) },
      { label: "Market price per sq ft", value: money.format(roundMoney(analysis.marketPricePerSqFt)) }
    ])}
  `;
}

document.querySelectorAll<HTMLElement>("[data-calculator]").forEach((root) => {
  const button = root.querySelector<HTMLButtonElement>("[data-calculate]");
  const reset = root.querySelector<HTMLButtonElement>("[data-reset]");
  const result = root.querySelector<HTMLElement>("[data-result]");
  if (!button || !result) return;

  root.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input, select").forEach((input) => {
    input.addEventListener("input", () => {
      input.closest<HTMLElement>(".input-field")?.classList.remove("has-error");
      input.removeAttribute("aria-invalid");
      if (input instanceof HTMLInputElement && input.dataset.numberInput !== undefined) {
        formatNumberInput(input);
      }
    });
  });

  button.addEventListener("click", () => {
    clearErrors(root);
    const type = root.dataset.calculator;
    if (type === "rent-estimate") renderRentEstimate(root, result);
    if (type === "rent-comparison") renderRentComparison(root, result);
    if (type === "market-rent-analysis") renderMarketAnalysis(root, result);
  });

  reset?.addEventListener("click", () => {
    root.querySelectorAll<HTMLInputElement>("input").forEach((input) => {
      input.value = "";
      input.removeAttribute("aria-invalid");
    });
    clearErrors(root);
    result.innerHTML = '<p class="result-muted">Enter your numbers and click Calculate to see the result.</p>';
  });
});
