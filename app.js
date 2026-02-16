const POWERS = [
  "Scale Economies",
  "Network Economies",
  "Counter Positioning",
  "Switching Costs",
  "Branding",
  "Cornered Resource",
  "Process Power",
];

const POWER_DETAILS = {
  "Scale Economies": {
    definition:
      "A company gains a structural cost advantage as volume grows, allowing it to spread fixed costs and negotiate better unit economics than smaller rivals.",
    passWhy:
      "The company appears to operate in categories where large distribution, infrastructure, or procurement scale can lower per-unit cost and improve reinvestment capacity.",
    failWhy:
      "The available signals do not clearly show a durable cost curve advantage from scale beyond what competitors can likely replicate.",
  },
  "Network Economies": {
    definition:
      "The product or platform becomes more valuable as additional users, creators, merchants, or partners join the network.",
    passWhy:
      "The business model likely benefits from participation loops where growth on one side of the market strengthens value for the other side.",
    failWhy:
      "No strong direct network loop is evident from the current signals; value may come more from product quality than user-to-user reinforcement.",
  },
  "Counter Positioning": {
    definition:
      "A newcomer adopts a superior model that incumbents struggle to copy because doing so would damage their existing economics or channels.",
    passWhy:
      "The company appears to use a model that can pressure legacy incumbents who face internal conflicts when trying to match it.",
    failWhy:
      "There is no clear sign that incumbents are trapped by their own business model in a way that uniquely protects this company.",
  },
  "Switching Costs": {
    definition:
      "Customers face practical, financial, or operational friction when moving to another provider.",
    passWhy:
      "The product likely sits in workflows where migration risk, retraining, integration effort, or data movement creates real customer stickiness.",
    failWhy:
      "Switching appears feasible without major disruption, so customer retention may rely more on pricing or brand than structural lock-in.",
  },
  Branding: {
    definition:
      "Brand creates preference, trust, and perceived differentiation that supports demand and pricing resilience.",
    passWhy:
      "The company likely commands attention and customer trust that can sustain volume or pricing even in competitive markets.",
    failWhy:
      "The current evidence does not clearly indicate unusually strong brand-driven preference versus functional substitutes.",
  },
  "Cornered Resource": {
    definition:
      "The firm has privileged access to a scarce asset (IP, talent, distribution slot, data source, or supply chain position) that rivals cannot easily obtain.",
    passWhy:
      "Signals suggest access to constrained resources or capabilities that may not be broadly available to competitors at similar quality and speed.",
    failWhy:
      "No obvious scarce asset control is visible from the current inputs; competitors may access similar resources over time.",
  },
  "Process Power": {
    definition:
      "The company develops embedded routines, tacit know-how, and execution systems that are difficult to copy quickly.",
    passWhy:
      "The business appears to have accumulated operating know-how that compounds through repetition and organization-specific learning.",
    failWhy:
      "The current signal set does not clearly show a distinctive operational system that others would struggle to imitate.",
  },
};

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

const PROFILE_ALIASES = {
  msft: "microsoft",
  "microsoft corporation": "microsoft",
  "microsoft corp": "microsoft",
  "apple inc": "apple",
  aapl: "apple",
  googl: "alphabet",
  goog: "alphabet",
  "alphabet inc": "alphabet",
  amzn: "amazon",
  "amazon.com": "amazon",
  "amazon com": "amazon",
  nvda: "nvidia",
  "nvidia corporation": "nvidia",
  ko: "coca-cola",
  "coca cola": "coca-cola",
  "coca cola co": "coca-cola",
  "coca cola company": "coca-cola",
  meta: "meta",
  "meta platforms": "meta",
  "meta platforms inc": "meta",
  tsla: "tesla",
  "tesla inc": "tesla",
};

const LEGAL_SUFFIXES = [
  "inc",
  "incorporated",
  "corp",
  "corporation",
  "co",
  "company",
  "ltd",
  "limited",
  "plc",
  "sa",
  "ag",
  "nv",
  "holdings",
  "group",
  "class a",
  "class b",
];

const KEYWORD_RULES = [
  {
    pattern: /(bank|financial|insurance|payments|visa|mastercard|exchange)/,
    hits: ["Switching Costs", "Scale Economies", "Branding"],
    summary: "Financial platforms often benefit from trust, scale, and customer inertia.",
    label: "financial services signals",
  },
  {
    pattern: /(software|cloud|saas|systems|oracle|salesforce|adobe|sap)/,
    hits: ["Switching Costs", "Scale Economies", "Process Power"],
    summary: "Enterprise software usually compounds through lock-in and efficient product iteration.",
    label: "enterprise software signals",
  },
  {
    pattern: /(consumer|beverage|food|retail|nike|pepsi|unilever|procter)/,
    hits: ["Branding", "Scale Economies"],
    summary: "Consumer businesses can build moats around brand preference and distribution density.",
    label: "consumer brand signals",
  },
  {
    pattern: /(semiconductor|chip|ai|compute|data)/,
    hits: ["Cornered Resource", "Scale Economies", "Process Power"],
    summary: "Advanced compute firms often rely on scarce talent/IP and deep process know-how.",
    label: "advanced compute signals",
  },
  {
    pattern: /(social|platform|marketplace|booking|airbnb|uber)/,
    hits: ["Network Economies", "Scale Economies", "Branding"],
    summary: "Platforms may benefit from reinforcing participation loops between users and suppliers.",
    label: "platform/network signals",
  },
];

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

function simplifyName(name) {
  return normalizeName(name)
    .replace(/&/g, " and ")
    .replace(/[.'(),/\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function removeLegalSuffixes(name) {
  const parts = name.split(" ");
  while (parts.length > 1) {
    const tailTwo = parts.slice(-2).join(" ");
    const tailOne = parts[parts.length - 1];
    if (LEGAL_SUFFIXES.includes(tailTwo)) {
      parts.splice(-2, 2);
    } else if (LEGAL_SUFFIXES.includes(tailOne)) {
      parts.pop();
    } else {
      break;
    }
  }
  return parts.join(" ").trim();
}

function canonicalCompanyKey(inputName) {
  const simplified = simplifyName(inputName);
  const withoutSuffixes = removeLegalSuffixes(simplified);
  const alias = PROFILE_ALIASES[withoutSuffixes] || PROFILE_ALIASES[simplified];

  if (alias) {
    return alias;
  }

  const hyphenated = withoutSuffixes.replace(/\s+/g, "-");
  return COMPANY_PROFILES[withoutSuffixes] ? withoutSuffixes : hyphenated;
}

function analyzeCompany(inputName) {
  const rawName = normalizeName(inputName);
  const canonicalKey = canonicalCompanyKey(inputName);
  const profile = COMPANY_PROFILES[canonicalKey];

  if (profile) {
    return {
      hits: new Set(profile.hits),
      summary: profile.summary,
      source: "company-profile",
      signalExplanation: "Matched a curated company profile (including alias/ticker normalization).",
    };
  }

  const keywordSearchText = `${rawName} ${simplifyName(inputName)} ${canonicalKey}`;
  const matchedRules = KEYWORD_RULES.filter((rule) => rule.pattern.test(keywordSearchText));
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
      signalExplanation: "No keyword rules matched; baseline assumptions applied.",
    };
  }

  return {
    hits,
    summary: matchedRules[0].summary,
    source: "keyword-rules",
    signalExplanation: `Matched: ${matchedRules.map((rule) => rule.label).join(", ")}.`,
  };
}

function powerAssessmentText(power, hit, analysis) {
  const details = POWER_DETAILS[power];
  const statusReason = hit ? details.passWhy : details.failWhy;

  const methodReason =
    analysis.source === "company-profile"
      ? "Assessment basis: curated company-level profile evidence."
      : analysis.source === "keyword-rules"
        ? `Assessment basis: inferred from company-name keyword signals. ${analysis.signalExplanation}`
        : "Assessment basis: baseline estimate because no profile or keyword signal was available.";

  return {
    definition: details.definition,
    statusReason,
    methodReason,
  };
}

function renderResult(companyName, analysis) {
  resultsSection.hidden = false;
  companyHeading.textContent = `Result for ${companyName}`;
  summary.textContent = `${analysis.summary} ${analysis.signalExplanation}`;
  scoreValue.textContent = String(analysis.hits.size);

  powerList.innerHTML = "";

  POWERS.forEach((power) => {
    const hit = analysis.hits.has(power);
    const item = document.createElement("li");
    item.className = `power-item ${hit ? "hit" : "miss"}`;

    const text = powerAssessmentText(power, hit, analysis);

    item.innerHTML = `
      <span class="badge">${hit ? "✓" : "✕"}</span>
      <div>
        <div class="power-title">${power}</div>
        <p class="power-definition"><strong>What it means:</strong> ${text.definition}</p>
        <p class="power-reason"><strong>${hit ? "Why it passed:" : "Why it did not pass:"}</strong> ${text.statusReason}</p>
        <p class="power-method">${text.methodReason}</p>
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
