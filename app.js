const POWERS = [
  "Scale Economies",
  "Network Economies",
  "Counter Positioning",
  "Switching Costs",
  "Branding",
  "Cornered Resource",
  "Process Power",
];

const COMPANY_PROFILES = {
  microsoft: {
    hits: ["Scale Economies", "Network Economies", "Switching Costs", "Process Power"],
    summary: "Global software ecosystem, enterprise lock-in, and platform scale support multiple powers.",
  },
  apple: {
    hits: ["Scale Economies", "Switching Costs", "Branding", "Cornered Resource"],
    summary: "Premium brand with integrated hardware/software ecosystem and privileged supply chain access.",
  },
  alphabet: {
    hits: ["Scale Economies", "Network Economies", "Branding", "Process Power"],
    summary: "Search/data flywheel and ad platform scale reinforce durable economics.",
  },
  google: {
    hits: ["Scale Economies", "Network Economies", "Branding", "Process Power"],
    summary: "Search/data flywheel and ad platform scale reinforce durable economics.",
  },
  amazon: {
    hits: ["Scale Economies", "Switching Costs", "Process Power", "Cornered Resource"],
    summary: "Operational excellence and infrastructure scale are hard to replicate at comparable cost.",
  },
  nvidia: {
    hits: ["Scale Economies", "Switching Costs", "Cornered Resource", "Process Power"],
    summary: "AI hardware leadership with ecosystem lock-in and hard-to-match design capabilities.",
  },
  "coca-cola": {
    hits: ["Branding", "Scale Economies", "Cornered Resource"],
    summary: "Iconic global brand and distribution strength support enduring pricing power.",
  },
  meta: {
    hits: ["Network Economies", "Scale Economies", "Branding"],
    summary: "User network effects and advertiser reach reinforce each other.",
  },
  tesla: {
    hits: ["Branding", "Scale Economies", "Counter Positioning", "Process Power"],
    summary: "Direct model, manufacturing iteration speed, and brand intensity create structural advantages.",
  },
};

const KEYWORD_RULES = [
  {
    pattern: /(bank|financial|insurance|payments|visa|mastercard|exchange)/,
    hits: ["Switching Costs", "Scale Economies", "Branding"],
    summary: "Financial platforms often benefit from trust, scale, and customer inertia.",
  },
  {
    pattern: /(software|cloud|saas|systems|oracle|salesforce|adobe|sap)/,
    hits: ["Switching Costs", "Scale Economies", "Process Power"],
    summary: "Enterprise software usually compounds through lock-in and efficient product iteration.",
  },
  {
    pattern: /(consumer|beverage|food|retail|nike|pepsi|unilever|procter)/,
    hits: ["Branding", "Scale Economies"],
    summary: "Consumer businesses can build moats around brand preference and distribution density.",
  },
  {
    pattern: /(semiconductor|chip|ai|compute|data)/,
    hits: ["Cornered Resource", "Scale Economies", "Process Power"],
    summary: "Advanced compute firms often rely on scarce talent/IP and deep process know-how.",
  },
  {
    pattern: /(social|platform|marketplace|booking|airbnb|uber)/,
    hits: ["Network Economies", "Scale Economies", "Branding"],
    summary: "Platforms may benefit from reinforcing participation loops between users and suppliers.",
  },
];

const POWER_REASONS = {
  "Scale Economies": "Cost advantages improve as output/distribution scales.",
  "Network Economies": "Product value rises as more participants join.",
  "Counter Positioning": "A different model exploits incumbent constraints.",
  "Switching Costs": "Customers face friction/risk in changing providers.",
  Branding: "Differentiation and trust support pricing resilience.",
  "Cornered Resource": "Access to scarce assets/talent/IP limits competition.",
  "Process Power": "Embedded routines and know-how are difficult to copy quickly.",
};

const form = document.querySelector("#moatForm");
const companyInput = document.querySelector("#companyInput");
const resultsSection = document.querySelector("#results");
const companyHeading = document.querySelector("#companyHeading");
const summary = document.querySelector("#summary");
const scoreValue = document.querySelector("#scoreValue");
const powerList = document.querySelector("#powerList");

function normalizeName(name) {
  return name.trim().toLowerCase();
}

function analyzeCompany(inputName) {
  const name = normalizeName(inputName);
  const profile = COMPANY_PROFILES[name];

  if (profile) {
    return {
      hits: new Set(profile.hits),
      summary: profile.summary,
      source: "company-profile",
    };
  }

  const matchedRules = KEYWORD_RULES.filter((rule) => rule.pattern.test(name));
  const hits = new Set();

  matchedRules.forEach((rule) => {
    rule.hits.forEach((power) => hits.add(power));
  });

  if (hits.size === 0) {
    ["Scale Economies", "Branding"].forEach((power) => hits.add(power));
    return {
      hits,
      summary:
        "No direct profile match was found, so this estimate uses a conservative baseline typical for large public firms.",
      source: "baseline",
    };
  }

  return {
    hits,
    summary: matchedRules[0].summary,
    source: "keyword-rules",
  };
}

function renderResult(companyName, analysis) {
  resultsSection.hidden = false;
  companyHeading.textContent = `Result for ${companyName}`;
  summary.textContent = analysis.summary;
  scoreValue.textContent = String(analysis.hits.size);

  powerList.innerHTML = "";

  POWERS.forEach((power) => {
    const hit = analysis.hits.has(power);
    const item = document.createElement("li");
    item.className = `power-item ${hit ? "hit" : "miss"}`;

    item.innerHTML = `
      <span class="badge">${hit ? "✓" : "✕"}</span>
      <div>
        <div class="power-title">${power}</div>
        <p class="power-reason">${POWER_REASONS[power]}</p>
      </div>
    `;

    powerList.appendChild(item);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const companyName = companyInput.value.trim();
  if (!companyName) return;

  const analysis = analyzeCompany(companyName);
  renderResult(companyName, analysis);
});
